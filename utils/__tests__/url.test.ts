import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { HttpsUrlFromString } from "../url";

describe("HttpsUrlFromString", () => {
  it.each`
    title                       | value                                 | expected
    ${"without trailing slash"} | ${"https://example.com/path/to/api"}  | ${"https://example.com/path/to/api"}
    ${"with trailing slash"}    | ${"https://example.com/path/to/api/"} | ${"https://example.com/path/to/api"}
    ${"with host only"}         | ${"https://example.com"}              | ${"https://example.com"}
  `("should remove trainling slashes $title", ({ value, expected }) => {
    HttpsUrlFromString.decode(value).fold(
      _ => fail(`Failed to decode ${value}: ${readableReport(_)}`),
      e => {
        expect(e.href).toBe(expected);
      }
    );
  });

  it.each`
    title           | value
    ${"not an url"} | ${"not-an-url"}
    ${"not https"}  | ${"http://example.com/path/to/api/"}
  `("should not decode $title", ({ value }) => {
    HttpsUrlFromString.decode(value).fold(
      _ => {
        expect(1).toBe(1);
      },
      _ => fail(`Should not succeed`)
    );
  });
});
