import * as zlib from "pako";
import { Either } from "fp-ts/lib/Either";
import * as e from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { Certificates } from "./certificate";

/* eslint-disable @typescript-eslint/no-var-requires */
const borc = require("borc");
/* eslint-disable @typescript-eslint/no-var-requires */
const base45 = require("base45-js");

const removePrefix = (s: string): string =>
  s.startsWith("HC1:") ? s.substring(4) : s;

const inflate = (b: Buffer): Uint8Array =>
  b[0] === 0x78 ? zlib.inflate(b) : b;

interface IBorcDecoded {
  readonly value: ReadonlyArray<Buffer>;
}

export const parseQRCode = (qrcode: string): Either<string, Certificates> =>
  e
    .right<Error | Errors, string>(removePrefix(qrcode))
    .map<Buffer>(base45.decode)
    .map(inflate)
    .map<IBorcDecoded>(borc.decodeFirst)
    .map(cose => cose.value[2])
    .map<ReadonlyMap<number, ReadonlyMap<number, unknown>>>(borc.decode)
    .chain<ReadonlyMap<number, unknown>>(m =>
      e.fromNullable(new Error("borc decode failed: missing -270 map entry"))(
        m.get(-260)
      )
    )
    .map(m => m.get(1))
    .chain(Certificates.decode)
    .mapLeft(_ => qrcode);
