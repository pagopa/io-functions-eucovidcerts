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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ITALIAN_LOGO_ID = "esenzione";

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
    title: "EU Digital COVID Certificate"
  },
  [PreferredLanguageEnum.de_DE]: {
    subtitle: "",
    title: "Grünes COVID-19-Zertifikat"
  }
};

/* 
Title and subtitle of exemption certificate header 
for each supported language
*/
const exemptionTitleAndSubtitle: {
  [key in SupportedLanguage]: Omit<HeaderInfo, "logo_id">;
} = {
  [PreferredLanguageEnum.it_IT]: {
    subtitle: "",
    title: "Certificazione digitale di esenzione dalla vaccinazione anti-COVID-19" as NonEmptyString
  },
  [PreferredLanguageEnum.en_GB]: {
    subtitle: "",
    title: "Digital COVID-19 vaccination exemption certificate" as NonEmptyString
  },
  [PreferredLanguageEnum.de_DE]: {
    subtitle: "",
    title: "Digital COVID-19 vaccination exemption certificate" as NonEmptyString
  }
};

const getStandardHeader = (language: SupportedLanguage): HeaderInfo => ({
  ...standardTitleAndSubtitle[language],
  logo_id: EUROPEAN_LOGO_ID
});

const getExemptionHeader = (language: SupportedLanguage): HeaderInfo => ({
  ...exemptionTitleAndSubtitle[language],
  logo_id: ITALIAN_LOGO_ID
});

const emptyHeader: HeaderInfo = {
  logo_id: "",
  subtitle: "",
  title: ""
};

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
        .when(ExemptionCertificate.is, _ivc => getExemptionHeader(language))
        .exhaustive()
  );

export const getFallbackHeaderInfoForLanguage = (
  _lang: O.Option<PreferredLanguageEnum>
): HeaderInfo => emptyHeader;
