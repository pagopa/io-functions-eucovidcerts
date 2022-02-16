import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";
import { aValidRecoveryCertificate } from "../../__mocks__/certificates";

import { Certificates } from "../certificate";
import { printDetails } from "../printer";

const language = PreferredLanguageEnum.en_GB;

describe(`Printer - Recovery - Detail - ${language}`, () => {
  it("should print its markdown", () => {
    const certificate = pipe(
      Certificates.decode(aValidRecoveryCertificate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(language), certificate);
    expect(result).toMatchSnapshot();
  });

  it("should print extended validation if `cbis` flag is defined", () => {
    const certificate = pipe(
      Certificates.decode(aValidRecoveryCertificate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(language), certificate, "cbis");
    expect(result).toMatchSnapshot();
  });

  it("should print its markdown with placeholder, if some value is not in valueset", () => {
    const certificate = pipe(
      Certificates.decode({
        ...aValidRecoveryCertificate,
        r: [
          {
            ...aValidRecoveryCertificate.r[0],
            tg: "NOTPRESENT"
          }
        ]
      }),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(language), certificate);
    expect(result).toMatchSnapshot();
  });
});
