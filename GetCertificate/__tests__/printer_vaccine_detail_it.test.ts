import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails } from "../printer";

describe("Printer - Test - Detail - it_IT", () => {
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
            is: "IT",
            ci: "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
          }
        ]
      }),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printDetails(some(PreferredLanguageEnum.it_IT), certificate);
    expect(result).toMatchSnapshot();
  });
});
