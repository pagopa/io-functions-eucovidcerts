import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails, printInfo } from "../printer";

import { aValidExemptionCertificateWithEndDate } from "../../__mocks__/certificates";

describe.each`
  preferredLanguage
  ${PreferredLanguageEnum.it_IT}
  ${PreferredLanguageEnum.en_GB}
  ${PreferredLanguageEnum.de_DE}
`(`Printer - Exemption - $preferredLanguage`, ({ preferredLanguage }) => {
  it("should print its info page", () => {
    const certificate = pipe(
      Certificates.decode(aValidExemptionCertificateWithEndDate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printInfo(some(preferredLanguage), certificate);
    expect(result).toMatchSnapshot();
  });

  it("should print detail page for exemption certificate", () => {
    const decodedCertificate = pipe(
      Certificates.decode(aValidExemptionCertificateWithEndDate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(preferredLanguage), decodedCertificate);
    expect(result).toMatchSnapshot();
  });
});
