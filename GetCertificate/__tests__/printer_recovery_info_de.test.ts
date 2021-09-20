import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { getOrElseW } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printInfo } from "../printer";

const language = PreferredLanguageEnum.de_DE;

describe(`Printer - Recovery - Info - ${language}`, () => {
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
        r: [
          {
            tg: "840539006",
            fr: "2021-04-10",
            co: "IT",
            is: "IT",
            df: "2021-04-20",
            du: "2021-09-10",
            ci: "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
          }
        ]
      }),
      getOrElseW(_ => {
        throw "Error decoding object";
      })
    );

    const result = printInfo(some(language), certificate);
    expect(result).toMatchSnapshot();
  });
});
