import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { pipe } from "fp-ts/lib/function";

import * as O from "fp-ts/lib/Option";
import { match } from "ts-pattern";
import { HeaderInfo } from "../generated/definitions/HeaderInfo";

import {
  DefaultLanguage,
  isSupportedLanguage,
  SupportedLanguage
} from "../utils/conversions";

import {
  Certificates,
  RecoveryCertificate,
  TestCertificate,
  VacCertificate
} from "./certificate";

const EUROPEAN_LOGO_ID = "1" as NonEmptyString;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ITALIAN_LOGO_ID = "2" as NonEmptyString;

/* 
Title and subtitle of certificate header 
for each supported languageF
*/

const standardTitleAndSubtitle: {
  [key in SupportedLanguage]: Omit<HeaderInfo, "logo_id">;
} = {
  [PreferredLanguageEnum.it_IT]: {
    subtitle: "",
    title: "Certificazione verde COVID-19" as NonEmptyString
  },
  [PreferredLanguageEnum.en_GB]: {
    subtitle: "",
    title: "EU Digital COVID Certificate" as NonEmptyString
  },
  [PreferredLanguageEnum.de_DE]: {
    subtitle: "",
    title: "Grünes COVID-19-Zertifikat" as NonEmptyString
  }
};

const getStandardHeader = (language: SupportedLanguage): HeaderInfo => ({
  ...standardTitleAndSubtitle[language],
  logo_id: EUROPEAN_LOGO_ID
});

const emptyHeader: HeaderInfo = {
  logo_id: "",
  subtitle: "",
  title: ""
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
    O.map(c =>
      match(c)
        .when(VacCertificate.is, _vc => getStandardHeader(language))
        .when(TestCertificate.is, _tc => getStandardHeader(language))
        .when(RecoveryCertificate.is, _rc => getStandardHeader(language))
        .exhaustive()
    ),
    O.getOrElse(() => emptyHeader)
  );
};
