/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { IReadonlyTranslatableMap } from "../../utils/conversions";

export const labTestTypes: IReadonlyTranslatableMap = {
  "LP6464-4": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Test molecolare",
      [PreferredLanguageEnum.en_GB]:
        "Nucleic acid amplification with probe detection"
    }
  },
  "LP217198-3": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Test antigenico rapido",
      [PreferredLanguageEnum.en_GB]: "Rapid immunoassay"
    }
  }
};
