import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";
import { aValidVaccinationCertificate } from "../../__mocks__/certificates";

import { Certificates } from "../certificate";
import { printDetails } from "../printer";

const language = PreferredLanguageEnum.it_IT;

describe(`Printer - Test - Detail - ${language}`, () => {
  it("should print its markdown", () => {
    const certificate = pipe(
      Certificates.decode(aValidVaccinationCertificate),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(language), certificate);
    expect(result).toMatchSnapshot();
  });

  it.each`
    doseNumber | totalDoses
    ${3}       | ${2}
    ${3}       | ${3}
    ${2}       | ${1}
  `(
    "should print markdown in case of booster $doseNumber/$totalDoses",
    ({ doseNumber, totalDoses }) => {
      const certificate = pipe(
        Certificates.decode({
          ...aValidVaccinationCertificate,
          v: [
            {
              ...aValidVaccinationCertificate.v[0],
              dn: doseNumber,
              sd: totalDoses
            }
          ]
        }),
        getOrElseW(_ => {
          throw "Error decoding object";
        })
      );

      const result = printDetails(some(language), certificate);
      expect(result).toMatchSnapshot();
    }
  );
});
