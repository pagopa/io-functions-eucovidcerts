import * as zlib from "pako";
import { Either, toError } from "fp-ts/lib/Either";
import * as e from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { PNG, PNGWithMetadata } from "pngjs";
import jsQR from "jsqr";
import { QRCode } from "jsqr";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { match } from "ts-pattern";
import {
  Certificates,
  RecoveryCertificate,
  TestCertificate,
  VacCertificate
} from "./certificate";
import {
  getRecoveryCertificateValidationErrors,
  getTestCertificateValidationErrors,
  getVacCertificateValidationErrors
} from "./certificate.warnings";

/* eslint-disable @typescript-eslint/no-var-requires */
const borc = require("borc");
/* eslint-disable @typescript-eslint/no-var-requires */
const base45 = require("base45-js");

const removePrefix = (s: string): string =>
  s.startsWith("HC1:") ? s.substring(4) : s;

const inflate = (b: Buffer): Either<Error, Uint8Array> =>
  e.tryCatch2v(() => (b[0] === 0x78 ? zlib.inflate(b) : b), toError);

interface IBorcDecoded {
  readonly value: ReadonlyArray<Buffer>;
}

const base64ToBuffer = (base64: string): Either<Error, Buffer> =>
  e.tryCatch2v(() => Buffer.from(base64, "base64"), toError);

const bufferToPng = (buffer: Buffer): Either<Error, PNGWithMetadata> =>
  e.tryCatch2v(() => PNG.sync.read(buffer), toError);

const pngToQrcode = (png: PNGWithMetadata): Either<Error, QRCode> =>
  e
    .tryCatch2v(
      () => jsQR(Uint8ClampedArray.from(png.data), png.width, png.height),
      toError
    )
    .chain(
      e.fromNullable(
        new Error("can not find a valid qr code in the input image")
      )
    );

const base45Decode = (s: string): Either<Error, Buffer> =>
  e.tryCatch2v(() => base45.decode(s), toError);

const borcDecodeFirst = (bytes: Uint8Array): Either<Error, IBorcDecoded> =>
  e.tryCatch2v(() => borc.decodeFirst(bytes), toError);

const bordDecode = (
  b: Buffer
): Either<Error, ReadonlyMap<number, ReadonlyMap<number, unknown>>> =>
  e.tryCatch2v(() => borc.decode(b), toError);

const readHCert = <T>(m: ReadonlyMap<number, T>): Either<Error, T> =>
  e.fromNullable(new Error("borc decode failed: missing -260 map entry"))(
    m.get(-260)
  );

interface IQRParsingFailure {
  readonly qrcode: string;
  readonly reason: string;
}

/**
 * A wrapper for a parsing function which enhance its left results with a normalized logging message
 *
 * @param fn a parsing step function, which takes and input and returns either an error or the result of the specific step
 * @param stepName the name of the step to be logged. If the function is not anonymous, its name is used. Otherwise it must be specified
 * @returns either an error or the result of the specific step
 */
export const withTrace = <T, I>(
  fn: (i: I) => Either<Error | Errors, T>,
  stepName = fn.name
) => (i: I): Either<Error, T> =>
  fn(i).mapLeft(error => {
    const message =
      error instanceof Error ? error.message : readableReport(error);
    return new Error(`step: ${stepName}, error: ${message}`);
  });

/**
 * A wrapper for Certificate.decode,
 * that allows to log missing map values, if any
 *
 * @param logWarning a function used to log warning text
 * @returns Either a decoded certificate or a validation error
 */
export const decodeCertificateAndLogMissingValues = (
  logWarning: (warn: string) => void
) => (x: unknown): ReturnType<typeof Certificates.decode> => {
  const decodedValude = Certificates.decode(x);

  decodedValude.map(value => {
    match(value)
      .when(TestCertificate.is, te => getTestCertificateValidationErrors(te, x))
      .when(VacCertificate.is, vc => getVacCertificateValidationErrors(vc, x))
      .when(RecoveryCertificate.is, rc =>
        getRecoveryCertificateValidationErrors(rc, x)
      )
      .exhaustive()
      .mapLeft((err: string) => logWarning(`Missing map values|${err}`));
  });
  return decodedValude;
};

/**
 * Parse a qr code image to get Certificate information payload
 *
 * @param qrcode
 * @returns
 */
export const parseQRCode = (
  qrcode: string,
  logWarning: (warn: string) => void
): Either<IQRParsingFailure, Certificates> =>
  e
    .fromNullable<Error>(new Error("can not decode an empty string"))(qrcode)
    .chain(withTrace(base64ToBuffer))
    .chain(withTrace(bufferToPng))
    .chain(withTrace(pngToQrcode))
    .map(qr => qr.data)
    .map(removePrefix)
    .chain(withTrace(base45Decode))
    .chain(withTrace(inflate))
    .chain(withTrace(borcDecodeFirst))
    .map(cose => cose.value[2])
    .chain<ReadonlyMap<number, ReadonlyMap<number, unknown>>>(
      withTrace(bordDecode)
    )
    .chain<ReadonlyMap<number, unknown>>(withTrace(readHCert))
    .map(m => m.get(1))
    .chain(
      withTrace(
        decodeCertificateAndLogMissingValues(logWarning),
        "Certificates.decode"
      )
    )
    .mapLeft(_ => ({ qrcode, reason: _.message }));
