import * as crypto from "crypto";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { errorsToReadableMessages } from "@pagopa/ts-commons/lib/reporters";
import { Errors } from "io-ts";

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

export const errorsToError = (errors: Errors): Error =>
  new Error(errorsToReadableMessages(errors).join("|"));
