import * as crypto from "crypto";
import * as t from "io-ts";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { errorsToReadableMessages } from "@pagopa/ts-commons/lib/reporters";
import { Errors } from "io-ts";
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isNone, isSome, none, Option, Some, some } from "fp-ts/lib/Option";

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
export interface ITranslatable {
  readonly id: string;
  readonly displays: ReadonlyMap<PreferredLanguageEnum, string>;
}

/**
 * A function that returns a Codec mapping an input key with a pre-created ITranslatable
 */
export const toTWithMap = <T extends ITranslatable>(
  map: ReadonlyMap<string, T>
): t.Type<T, string, string> =>
  new t.Type<T, string, string>(
    "toTWithMap",
    (value: unknown): value is T =>
      Array.from(map.values()).some(v => v === value), // FIXME replace with deep compare
    (v, c) =>
      map.get(v)
        ? t.success(map.get(v) as T)
        : t.failure(v, c, "Value not contained in map"),
    value => value.id
  );

/**
 * A function that returns a Codec mapping an input key with a pre-created ITranslatable
 * if string is empty, return undefined
 */
export const toTWithMapOptional = <T extends ITranslatable>(
  map: ReadonlyMap<string, T>
): t.Type<Option<T>, string, string> =>
  new t.Type<Option<T>, string, string>(
    "toTWithMapOptional",
    (value: unknown): value is Option<T> =>
      !!value &&
      (isNone(value as Option<T>) ||
        Array.from(map.values()).some(v => v === (value as Some<T>).value)), // FIXME replace with deep compare
    (v, c) =>
      v
        ? map.get(v)
          ? t.success(some(map.get(v) as T))
          : t.failure(v, c, "Value not contained in map")
        : t.success(none),
    value => (isSome(value) ? value.value.id : "")
  );
