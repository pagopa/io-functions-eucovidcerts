/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import {
  PreferredLanguageEnum,
  PreferredLanguage
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ITranslatable } from "../../utils/conversions";

export const covid19LabTestTypes = new Map<string, ITranslatable>([
  [
    "LP6464-4",
    {
      id: "LP6464-4",
      displays: new Map<PreferredLanguage, string>([
        [
          PreferredLanguageEnum.it_IT,
          "Nucleic acid amplification with probe detection"
        ],
        [
          PreferredLanguageEnum.en_GB,
          "Nucleic acid amplification with probe detection"
        ]
      ])
    }
  ],
  [
    "LP217198-3",
    {
      id: "LP217198-3",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Rapid immunoassay"],
        [PreferredLanguageEnum.en_GB, "Rapid immunoassay"]
      ])
    }
  ]
]);
