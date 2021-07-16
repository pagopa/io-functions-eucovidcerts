import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printInfo } from "../printer";

const language = PreferredLanguageEnum.de_DE;

describe(`Printer - Test - Info - ${language}`, () => {
  it("should print its markdown", () => {
    const certificate = Certificates.decode({
      ver: "1.0.0",
      nam: {
        fn: "Di Caprio",
        fnt: "DI<CAPRIO",
        gn: "Marilù Teresa",
        gnt: "MARILU<TERESA"
      },
      dob: "1977-06-16",
      t: [
        {
          tg: "840539006",
          tt: "LP6464-4",
          nm: "Roche LightCycler qPCR",
          ma: "",
          sc: "2021-05-10T10:27:15Z",
          dr: "2021-05-11T12:27:15Z",
          tr: "260415000",
          tc: "Policlinico Umberto I",
          co: "IT",
          is: "IT",
          ci: "01IT0BFC9866D3854EAC82C21654B6F6DE32#1"
        }
      ]
    }).getOrElseL(_ => {
      throw "Error decoding object";
    });

    const result = printInfo(some(language), certificate);
    expect(result).toMatchSnapshot();
  });
});
