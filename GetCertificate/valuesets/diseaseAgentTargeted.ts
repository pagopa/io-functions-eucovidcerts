/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import {
  PreferredLanguageEnum,
  PreferredLanguage
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ITranslatable } from "../../utils/conversions";

export const diseaseAgentTargeted = new Map<string, ITranslatable>([
  [
    "840539006",
    {
      id: "840539006",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "COVID-19"],
        [PreferredLanguageEnum.en_GB, "COVID-19"]
      ])
    }
  ]
]);
