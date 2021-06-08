/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import {
  PreferredLanguageEnum,
  PreferredLanguage
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ITranslatable } from "../../utils/conversions";

export const vaccineMedicinalProduct = new Map<string, ITranslatable>([
  [
    "EU/1/20/1528",
    {
      id: "EU/1/20/1528",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Comirnaty"],
        [PreferredLanguageEnum.en_GB, "Comirnaty"]
      ])
    }
  ],
  [
    "EU/1/20/1507",
    {
      id: "EU/1/20/1507",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "COVID-19 Vaccine Moderna"],
        [PreferredLanguageEnum.en_GB, "COVID-19 Vaccine Moderna"]
      ])
    }
  ],
  [
    "EU/1/21/1529",
    {
      id: "EU/1/21/1529",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Vaxzevria"],
        [PreferredLanguageEnum.en_GB, "Vaxzevria"]
      ])
    }
  ],
  [
    "EU/1/20/1525",
    {
      id: "EU/1/20/1525",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "COVID-19 Vaccine Janssen"],
        [PreferredLanguageEnum.en_GB, "COVID-19 Vaccine Janssen"]
      ])
    }
  ],
  [
    "CVnCoV",
    {
      id: "CVnCoV",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "CVnCoV"],
        [PreferredLanguageEnum.en_GB, "CVnCoV"]
      ])
    }
  ],
  [
    "Sputnik-V",
    {
      id: "Sputnik-V",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Sputnik-V"],
        [PreferredLanguageEnum.en_GB, "Sputnik-V"]
      ])
    }
  ],
  [
    "Convidecia",
    {
      id: "Convidecia",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Convidecia"],
        [PreferredLanguageEnum.en_GB, "Convidecia"]
      ])
    }
  ],
  [
    "EpiVacCorona",
    {
      id: "EpiVacCorona",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "EpiVacCorona"],
        [PreferredLanguageEnum.en_GB, "EpiVacCorona"]
      ])
    }
  ],
  [
    "BBIBP-CorV",
    {
      id: "BBIBP-CorV",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "BBIBP-CorV"],
        [PreferredLanguageEnum.en_GB, "BBIBP-CorV"]
      ])
    }
  ],
  [
    "Inactivated-SARS-CoV-2-Vero-Cel",
    {
      id: "Inactivated-SARS-CoV-2-Vero-Cel",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Inactivated SARS-CoV-2 (Vero Cell)"],
        [PreferredLanguageEnum.en_GB, "Inactivated SARS-CoV-2 (Vero Cell)"]
      ])
    }
  ],
  [
    "CoronaVac",
    {
      id: "CoronaVac",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "CoronaVac"],
        [PreferredLanguageEnum.en_GB, "CoronaVac"]
      ])
    }
  ],
  [
    "Covaxin",
    {
      id: "Covaxin",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Covaxin (also known as BBV152 A, B, C)"],
        [PreferredLanguageEnum.en_GB, "Covaxin (also known as BBV152 A, B, C)"]
      ])
    }
  ]
]);
