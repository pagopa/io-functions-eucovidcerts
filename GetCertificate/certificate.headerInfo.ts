import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
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
  ExemptionCertificate,
  RecoveryCertificate,
  TestCertificate,
  VacCertificate
} from "./certificate";

const EUROPEAN_LOGO_ID = "greenpass";

/* 
Title and subtitle of certificate header 
for each supported language
*/
const standardTitleAndSubtitle: {
  [key in SupportedLanguage]: Omit<HeaderInfo, "logo_id">;
} = {
  [PreferredLanguageEnum.it_IT]: {
    subtitle: "",
    title: "Certificazione verde COVID-19"
  },
  [PreferredLanguageEnum.en_GB]: {
    subtitle: "",
    title: "EU Digital COVID-19 Certificate"
  },
  [PreferredLanguageEnum.de_DE]: {
    subtitle: "",
    title: "Grünes COVID-19-Zertifikat"
  }
};

const getStandardHeader = (language: SupportedLanguage): HeaderInfo => ({
  ...standardTitleAndSubtitle[language],
  logo_id: EUROPEAN_LOGO_ID
});

export const getHeaderInfoForLanguage = (
  lang: O.Option<PreferredLanguageEnum>
) => (certificate: Certificates): HeaderInfo =>
  pipe(
    lang,
    O.filter(isSupportedLanguage),
    O.getOrElse(() => DefaultLanguage),
    language =>
      match(certificate)
        .when(VacCertificate.is, _vc => getStandardHeader(language))
        .when(TestCertificate.is, _tc => getStandardHeader(language))
        .when(RecoveryCertificate.is, _rc => getStandardHeader(language))
        .when(ExemptionCertificate.is, _ivc => getStandardHeader(language))
        .exhaustive()
  );

export const getFallbackHeaderInfoForLanguage = (
  lang: O.Option<PreferredLanguageEnum>
): HeaderInfo =>
  pipe(
    lang,
    O.filter(isSupportedLanguage),
    O.getOrElse(() => DefaultLanguage),
    l => getStandardHeader(l)
  );
