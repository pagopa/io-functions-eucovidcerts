import * as zlib from "pako";
import { Either, toError } from "fp-ts/lib/Either";
import * as E from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { PNG, PNGWithMetadata } from "pngjs";
import jsQR from "jsqr";
import { QRCode } from "jsqr";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
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
  E.tryCatch(() => (b[0] === 0x78 ? zlib.inflate(b) : b), toError);

interface IBorcDecoded {
  readonly value: ReadonlyArray<Buffer>;
}

const base64ToBuffer = (base64: string): Either<Error, Buffer> =>
  E.tryCatch(() => Buffer.from(base64, "base64"), toError);

const bufferToPng = (buffer: Buffer): Either<Error, PNGWithMetadata> =>
  E.tryCatch(() => PNG.sync.read(buffer), toError);

const pngToQrcode = (png: PNGWithMetadata): Either<Error, QRCode> =>
  pipe(
    E.tryCatch(
      () => jsQR(Uint8ClampedArray.from(png.data), png.width, png.height),
      toError
    ),
    E.chain(
      E.fromNullable(
        new Error("can not find a valid qr code in the input image")
      )
    )
  );

const base45Decode = (s: string): Either<Error, Buffer> =>
  E.tryCatch(() => base45.decode(s), toError);

const borcDecodeFirst = (bytes: Uint8Array): Either<Error, IBorcDecoded> =>
  E.tryCatch(() => borc.decodeFirst(bytes), toError);

const bordDecode = (
  b: Buffer
): Either<Error, ReadonlyMap<number, ReadonlyMap<number, unknown>>> =>
  E.tryCatch(() => borc.decode(b), toError);

const readHCert = <T>(m: ReadonlyMap<number, T>): Either<Error, T> =>
  E.fromNullable(new Error("borc decode failed: missing -260 map entry"))(
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
  pipe(
    fn(i),
    E.mapLeft(error => {
      const message =
        error instanceof Error ? error.message : readableReport(error);
      return new Error(`step: ${stepName}, error: ${message}`);
    })
  );

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

  pipe(
    decodedValude,
    E.map(value => {
      pipe(
        match(value)
          .when(TestCertificate.is, te =>
            getTestCertificateValidationErrors(te, x)
          )
          .when(VacCertificate.is, vc =>
            getVacCertificateValidationErrors(vc, x)
          )
          .when(RecoveryCertificate.is, rc =>
            getRecoveryCertificateValidationErrors(rc, x)
          )
          .exhaustive(),
        E.mapLeft((err: string) => logWarning(`Missing map values|${err}`))
      );
    })
  );
  return decodedValude;
};

// exported for testing purpose
export const extractDataFromPng = (
  rawPng: NonEmptyString
): Either<Error, string> =>
  pipe(
    E.right(rawPng),
    E.chain(withTrace(base64ToBuffer)),
    E.chain(withTrace(bufferToPng)),
    E.chain(withTrace(pngToQrcode)),
    E.map(qr => qr.data)
  );

// exported for testing purpose
export const decodeCertificateData = (logWarning: (warn: string) => void) => (
  data: string
): Either<Error, Certificates> =>
  pipe(
    E.right(data),
    E.map(removePrefix),
    E.chain(withTrace(base45Decode)),
    E.chain(withTrace(inflate)),
    E.chain(withTrace(borcDecodeFirst)),
    E.map(cose => cose.value[2]),
    E.chain(withTrace(bordDecode)),
    E.chain(withTrace(readHCert)),
    E.map(m => m.get(1)),
    E.chain(
      withTrace(
        decodeCertificateAndLogMissingValues(logWarning),
        "Certificates.decode"
      )
    )
  );

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
  pipe(
    // formal input validation
    qrcode,
    NonEmptyString.decode,
    E.mapLeft(_ => new Error("can not decode an empty string")),

    // get data from encoded png string
    E.chain(extractDataFromPng),

    // parse certificate data
    E.chain(decodeCertificateData(logWarning)),

    // map an eventually occurred error
    E.mapLeft(_ => ({ qrcode, reason: _.message }))
  );
