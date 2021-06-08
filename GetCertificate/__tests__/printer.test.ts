import {
    PreferredLanguage,
    PreferredLanguageEnum
  } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";

import { createDetailsPrinter } from "../printer";
import { ParsedCertificate } from '../certificate';

describe("Printers", () => {

    it("should print it markdown", () =>
    {
        const certificate = ParsedCertificate.decode({
            "ver" : "1.0.0",
            "nam" : {
              "fn" : "Di Caprio",
              "fnt" : "DI<CAPRIO",
              "gn" : "Marilù Teresa",
              "gnt" : "MARILU<TERESA"
            },
            "dob" : "1977-06-16",
            "v" : [ {
              "tg" : "840539006",
              "vp" : "1119349007",
              "mp" : "EU/1/20/1528",
              "ma" : "ORG-100030215",
              "dn" : 2,
              "sd" : 2,
              "dt" : "2021-04-10",
              "co" : "IT",
              "is" : "IT",
              "ci" : "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
            } ]
          }
        ).getOrElseL(() => {throw "";});


        const printer = createDetailsPrinter(PreferredLanguageEnum.it_IT);
        const result = printer(certificate);

        expect(result).toMatchSnapshot();
    })
})