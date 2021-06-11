/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import {
  PreferredLanguageEnum,
  PreferredLanguage
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";

export const testResults = {
  "260415000": {
    displays: new Map<PreferredLanguage, string>([
      [PreferredLanguageEnum.it_IT, "Negativo"],
      [PreferredLanguageEnum.en_GB, "Not detected"]
    ])
  },
  "260373001": {
    displays: new Map<PreferredLanguage, string>([
      [PreferredLanguageEnum.it_IT, "Positivo"],
      [PreferredLanguageEnum.en_GB, "Detected"]
    ])
  }
};
