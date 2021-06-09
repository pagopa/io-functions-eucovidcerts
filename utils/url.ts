import * as t from "io-ts";
import {
  HttpsUrlFromString as HttpsUrlFromStringBase,
  ValidUrl
} from "@pagopa/ts-commons/lib/url";

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
    HttpsUrlFromStringBase.decode(v).map(
      url =>
        (({
          ...url,
          href: removeTrailing("/")(url.href)
        } as unknown) as ValidUrl)
    ),
  a => a.toString()
);
