import * as t from "io-ts";

import * as E from "fp-ts/lib/Either";

import {
  HttpsUrlFromString as HttpsUrlFromStringBase,
  ValidUrl
} from "@pagopa/ts-commons/lib/url";
import { pipe } from "fp-ts/lib/function";

const removeTrailing = (postfix: string) => (subject: string): string =>
  subject.endsWith(postfix)
    ? subject.substr(0, subject.length - postfix.length)
    : subject;

/**
 * Wraps HttpsUrlFromString so that trailing slashes are removed
 */
export const HttpsUrlFromString = new t.Type<ValidUrl, string>(
  "HttpsUrlFromString",
  (e: unknown): e is ValidUrl => HttpsUrlFromStringBase.is(e),
  v =>
    pipe(
      HttpsUrlFromStringBase.decode(v),
      E.map(
        url =>
          (({
            ...url,
            href: removeTrailing("/")(url.href)
          } as unknown) as ValidUrl)
      )
    ),
  a => a.toString()
);
