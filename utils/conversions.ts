import * as crypto from "crypto";
import * as t from "io-ts";

// import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { errorsToReadableMessages } from "@pagopa/ts-commons/lib/reporters";
import { Errors } from "io-ts";
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import * as o from "fp-ts/lib/Option";

/**
 * Convert a string into SHA256
 *
 * @param source
 * @returns
 */
export const toSHA256 = (source: string): string =>
  crypto
    .createHash("sha256")
    .update(source)
    .digest("hex");

export const errorsToError = (errors: Errors): Error =>
  new Error(errorsToReadableMessages(errors).join("|"));

/**
 * An object representing a value translated in every supported languages
 */

export type SuportedLanguage =
  | PreferredLanguageEnum.en_GB
  | PreferredLanguageEnum.it_IT;

export interface ITranslatable {
  readonly displays: { [key in SuportedLanguage]: string };
}

export interface IReadonlyTranslatableMap {
  readonly [key: string]: ITranslatable;
}
export interface IReadonlyMap {
  readonly [key: string]: string;
}

/**
 * A function that returns a Codec mapping an input key with a pre-created ITranslatable
 */
export const toTWithMap = <T>(map: {
  readonly [key: string]: T;
}): t.Type<T, string, string> =>
  new t.Type<T, string, string>(
    "toTWithMap",
    (value: unknown): value is T => Object.values(map).some(v => v === value),
    (v, c) =>
      map[v]
        ? t.success(map[v])
        : t.failure(v, c, "Value not contained in map"),
    value => Object.keys(map).find(key => map[key] === value) ?? ""
  );

/**
 * A function that returns a Codec mapping an input key with a pre-created ITranslatable
 * if string is empty, return undefined
 */
export const toTWithMapOptional = <T>(map: {
  readonly [key: string]: T;
}): t.Type<o.Option<T>, string, string> =>
  new t.Type<o.Option<T>, string, string>(
    "toTWithMapOptional",
    (value: unknown): value is o.Option<T> =>
      !!value &&
      (o.isNone(value as o.Option<T>) ||
        Object.values(map).some(v => v === (value as o.Some<T>).value)),
    (v, c) =>
      v
        ? map[v]
          ? t.success(o.some(map[v]))
          : t.failure(v, c, "Value not contained in map")
        : t.success(o.none),
    value =>
      o.isSome(value)
        ? Object.keys(map).find(key => map[key] === value.value) ?? ""
        : ""
  );
