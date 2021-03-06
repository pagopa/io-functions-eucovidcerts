import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails } from "../printer";

describe("Printer - Test - Detail - en_EN", () => {
  it("should print its markdown", () => {
    const certificate = pipe(
      Certificates.decode({
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
            tt: "LP217198-3",
            nm: "Roche LightCycler qPCR",
            ma: "1232",
            sc: "2021-05-10T10:27:15Z",
            dr: "2021-05-11T12:27:15Z",
            tr: "260415000",
            tc: "Policlinico Umberto I",
            co: "IT",
            is: "IT",
            ci: "01IT0BFC9866D3854EAC82C21654B6F6DE32#1"
          }
        ]
      }),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(PreferredLanguageEnum.en_GB), certificate);
    expect(result).toMatchSnapshot();
  });
});
