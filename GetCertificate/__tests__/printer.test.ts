import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails } from "../printer";

describe("Printers", () => {
  it("should print it markdown - vaccine certificate", () => {
    const certificate = Certificates.decode({
      ver: "1.0.0",
      nam: {
        fn: "Di Caprio",
        fnt: "DI<CAPRIO",
        gn: "Marilù Teresa",
        gnt: "MARILU<TERESA"
      },
      dob: "1977-06-16",
      v: [
        {
          tg: "840539006",
          vp: "1119349007",
          mp: "EU/1/20/1528",
          ma: "ORG-100030215",
          dn: 2,
          sd: 2,
          dt: "2021-04-10",
          co: "IT",
          is: "IT-issuer",
          ci: "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
        }
      ]
    }).getOrElseL(_ => {
      throw "Error decoding object";
    });

    const result = printDetails(some(PreferredLanguageEnum.it_IT), certificate);
    expect(result).toMatchSnapshot();
  });

  it("should print it markdown - test certificate", () => {
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

    const result = printDetails(some(PreferredLanguageEnum.it_IT), certificate);
    expect(result).toMatchSnapshot();
  });
});
