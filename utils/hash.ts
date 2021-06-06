import * as crypto from "crypto";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

/**
 * Convert a string into SHA256
 *
 * @param source
 * @returns
 */
export const toHash = (source: FiscalCode): string =>
  crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");
