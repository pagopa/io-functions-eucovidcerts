import * as crypto from "crypto";
import * as t from "io-ts";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

/**
 * Convert a string into SHA256
 *
 * @param source
 * @returns
 */
export const toSHA256 = (source: FiscalCode): string =>
  crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

export const StringFromBase64 = new t.Type<string, string, string>(
  "StringFromBase64",
  (e): e is string => typeof e === "string",
  (u, c) => {
    try {
      return t.success(Buffer.from(u, "base64").toString("utf-8"));
    } catch (ex) {
      return t.failure(u, c, ex.message);
    }
  },
  e => Buffer.from(e).toString("base64")
);
