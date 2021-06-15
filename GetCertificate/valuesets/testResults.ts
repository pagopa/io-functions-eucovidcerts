/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { IReadonlyTranslatableMap } from "../../utils/conversions";

export const testResults: IReadonlyTranslatableMap = {
  "260415000": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Negativo",
      [PreferredLanguageEnum.en_GB]: "Not detected"
    }
  },
  "260373001": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Positivo",
      [PreferredLanguageEnum.en_GB]: "Detected"
    }
  }
};
