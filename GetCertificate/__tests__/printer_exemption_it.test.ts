import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails, printInfo } from "../printer";

import { aValidExemptionCertificate } from "../../__mocks__/certificates";

const preferredLanguage = PreferredLanguageEnum.it_IT;

describe(`Printer - Exemption - ${preferredLanguage}`, () => {
  it("should print its info page", () => {
    const certificate = pipe(
      Certificates.decode(aValidExemptionCertificate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printInfo(some(preferredLanguage), certificate);
    expect(result).toMatchSnapshot();
  });

  it("should print its detail page", () => {
    const certificate = pipe(
      Certificates.decode(aValidExemptionCertificate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(preferredLanguage), certificate);
    expect(result).toMatchSnapshot();
  });
});
