import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { pipe } from "fp-ts/lib/function";

import * as O from "fp-ts/lib/Option";

import {
  DefaultLanguage,
  isSupportedLanguage,
  SupportedLanguage
} from "../utils/conversions";

import { HeaderInfo } from "../generated/definitions/HeaderInfo";
import { Certificates } from "./certificate";

// TODO: Move to env variables
const EUROPEAN_LOGO_ID = "1" as NonEmptyString;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ITALIAN_LOGO_ID = "2" as NonEmptyString;

const standardTitleAndSubtitle: {
  [key in SupportedLanguage]: Omit<HeaderInfo, "logo_id">;
} = {
  [PreferredLanguageEnum.it_IT]: {
    subtitle: "",
    title: "TODO" as NonEmptyString
  },
  [PreferredLanguageEnum.en_GB]: {
    subtitle: "",
    title: "TODO" as NonEmptyString
  },
  [PreferredLanguageEnum.de_DE]: {
    subtitle: "",
    title: "TODO" as NonEmptyString
  }
};

export const getHeaderInfoForLanguage = (
  lang: O.Option<PreferredLanguageEnum>
) => (certificate: O.Option<Certificates>): HeaderInfo => {
  const language = pipe(
    lang,
    O.chain(l => (isSupportedLanguage(l) ? O.some(l) : O.none)),
    O.getOrElse(() => DefaultLanguage)
  );
  return pipe(
    certificate,
    O.map(_c => ({
      ...standardTitleAndSubtitle[language],
      logo_id: EUROPEAN_LOGO_ID
    })),
    O.getOrElse(() => ({
      ...standardTitleAndSubtitle[language],
      logo_id: EUROPEAN_LOGO_ID
    }))
  );
};
