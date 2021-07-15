/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { IReadonlyTranslatableMap } from "../../utils/conversions";
import { VALUESET_PLACEHOLDER } from "./placeholder";

export const testResults: IReadonlyTranslatableMap = {
  placeholder: {
    displays: {
      [PreferredLanguageEnum.it_IT]: VALUESET_PLACEHOLDER,
      [PreferredLanguageEnum.de_DE]: VALUESET_PLACEHOLDER,
      [PreferredLanguageEnum.en_GB]: VALUESET_PLACEHOLDER
    }
  },
  "260415000": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Negativo",
      [PreferredLanguageEnum.en_GB]: "Not detected",
      [PreferredLanguageEnum.de_DE]: "Negativer"
    }
  },
  "260373001": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "Positivo",
      [PreferredLanguageEnum.en_GB]: "Detected",
      [PreferredLanguageEnum.de_DE]: "Positiver"
    }
  }
};
