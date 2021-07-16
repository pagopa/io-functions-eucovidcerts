/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { IReadonlyTranslatableMap } from "../../utils/conversions";
import { VALUESET_PLACEHOLDER } from "./placeholder";

export const labTestTypes: IReadonlyTranslatableMap = {
  placeholder: {
    displays: {
      [PreferredLanguageEnum.it_IT]: VALUESET_PLACEHOLDER,
      [PreferredLanguageEnum.en_GB]: VALUESET_PLACEHOLDER,
      [PreferredLanguageEnum.de_DE]: VALUESET_PLACEHOLDER
    }
  },
  "LP6464-4": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Test molecolare",
      [PreferredLanguageEnum.de_DE]: "Molekularer Test",
      [PreferredLanguageEnum.en_GB]:
        "Nucleic acid amplification with probe detection"
    }
  },
  "LP217198-3": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Test antigenico rapido",
      [PreferredLanguageEnum.en_GB]: "Rapid immunoassay",
      [PreferredLanguageEnum.de_DE]: "Antigen-Schnelltest"
    }
  }
};
