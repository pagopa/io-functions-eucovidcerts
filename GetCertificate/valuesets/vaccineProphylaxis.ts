/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import {
  PreferredLanguageEnum,
  PreferredLanguage
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ITranslatable } from "../../utils/conversions";

export const vaccineProphylaxis = new Map<string, ITranslatable>([
  [
    "1119349007",
    {
      id: "1119349007",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "SARS-CoV-2 mRNA vaccine"],
        [PreferredLanguageEnum.en_GB, "SARS-CoV-2 mRNA vaccine"]
      ])
    }
  ],
  [
    "1119305005",
    {
      id: "1119305005",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "SARS-CoV-2 antigen vaccine"],
        [PreferredLanguageEnum.en_GB, "SARS-CoV-2 antigen vaccine"]
      ])
    }
  ],
  [
    "J07BX03",
    {
      id: "J07BX03",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "covid-19 vaccines"],
        [PreferredLanguageEnum.en_GB, "covid-19 vaccines"]
      ])
    }
  ]
]);
