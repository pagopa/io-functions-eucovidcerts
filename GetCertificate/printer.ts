/* eslint-disable sort-keys */
import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import * as o from "fp-ts/lib/Option";
import * as moment from "moment-timezone";
import { match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";
import { SupportedLanguage } from "../utils/conversions";
import {
  Certificates,
  TestCertificate,
  VacCertificate,
  VaccinationEntry,
  TestEntry,
  RecoveryCertificate,
  RecoveryEntry
} from "./certificate";
import * as vacDetailsEn from "./markdown/eucovidcertDetailsVaccinationEn";
import * as vacDetailsIt from "./markdown/eucovidcertDetailsVaccinationIt";
import * as vacDetailsDe from "./markdown/eucovidcertDetailsVaccinationDe";
import * as testDetailsIt from "./markdown/eucovidcertDetailsTestIt";
import * as testDetailsEn from "./markdown/eucovidcertDetailsTestEn";
import * as testDetailsDe from "./markdown/eucovidcertDetailsTestDe";
import * as recoveryDetailsIt from "./markdown/eucovidcertDetailsRecoveryIt";
import * as recoveryDetailsEn from "./markdown/eucovidcertDetailsRecoveryEn";
import * as recoveryDetailsDe from "./markdown/eucovidcertDetailsRecoveryDe";
import * as vacInfoMultilanguage from "./markdown/eucovidcertInfoVaccinationEn";
import * as vacInfoGerman from "./markdown/eucovidcertInfoVaccinationDe";
import * as expiredInfoIt from "./markdown/eucovidcertExpiredInfoIt";
import * as expiredInfoEn from "./markdown/eucovidcertExpiredInfoEn";
import * as expiredInfoDe from "./markdown/eucovidcertExpiredInfoDe";

import { labTestTypes, molecularTest } from "./valuesets/labTestTypes";

const TIME_ZONE = "Europe/Rome";

const DATE_FORMAT_EN = "YYYY-MM-DD";
const DATE_FORMAT_ITA = "DD-MM-YYYY";

const dateFormatForLanguage: { [key in SupportedLanguage]: string } = {
  [PreferredLanguageEnum.it_IT]: DATE_FORMAT_ITA,
  [PreferredLanguageEnum.en_GB]: DATE_FORMAT_EN,
  [PreferredLanguageEnum.de_DE]: DATE_FORMAT_EN
};

const DATE_TIME_FORMAT_EN = "YYYY-MM-DD HH:mm";
const DATE_TIME_FORMAT_ITA = "DD-MM-YYYY HH:mm";

const dateAndTimeFormatForLanguage: { [key in SupportedLanguage]: string } = {
  [PreferredLanguageEnum.it_IT]: DATE_TIME_FORMAT_ITA,
  [PreferredLanguageEnum.en_GB]: DATE_TIME_FORMAT_EN,
  [PreferredLanguageEnum.de_DE]: DATE_TIME_FORMAT_EN
};
interface IPrintersForLanguage {
  readonly expiredInfoPrinter: () => string;
  readonly detailVaccinePrinter: (v: VaccinationEntry) => string;
  readonly detailTestPrinter: (t: TestEntry) => string;
  readonly detailRecoveryPrinter: (r: RecoveryEntry) => string;
  readonly infoVaccinePrinter: (c: Certificates) => string;
  readonly infoTestPrinter: (c: Certificates) => string;
  readonly infoRecoveryPrinter: (c: Certificates) => string;
}

const printersConfigurations: {
  [key in SupportedLanguage]: IPrintersForLanguage;
} = {
  [PreferredLanguageEnum.it_IT]: {
    expiredInfoPrinter: expiredInfoIt.getInfoPrinter,
    detailVaccinePrinter: vacDetailsIt.getDetailPrinter,
    detailTestPrinter: testDetailsIt.getDetailPrinter,
    detailRecoveryPrinter: recoveryDetailsIt.getDetailPrinter,
    infoVaccinePrinter: vacInfoMultilanguage.getInfoPrinter,
    infoTestPrinter: vacInfoMultilanguage.getInfoPrinter,
    infoRecoveryPrinter: vacInfoMultilanguage.getInfoPrinter
  },
  [PreferredLanguageEnum.en_GB]: {
    expiredInfoPrinter: expiredInfoEn.getInfoPrinter,
    detailVaccinePrinter: vacDetailsEn.getDetailPrinter,
    detailTestPrinter: testDetailsEn.getDetailPrinter,
    detailRecoveryPrinter: recoveryDetailsEn.getDetailPrinter,
    infoVaccinePrinter: vacInfoMultilanguage.getInfoPrinter,
    infoTestPrinter: vacInfoMultilanguage.getInfoPrinter,
    infoRecoveryPrinter: vacInfoMultilanguage.getInfoPrinter
  },
  [PreferredLanguageEnum.de_DE]: {
    expiredInfoPrinter: expiredInfoDe.getInfoPrinter,
    detailVaccinePrinter: vacDetailsDe.getDetailPrinter,
    detailTestPrinter: testDetailsDe.getDetailPrinter,
    detailRecoveryPrinter: recoveryDetailsDe.getDetailPrinter,
    infoVaccinePrinter: vacInfoGerman.getInfoPrinter,
    infoTestPrinter: vacInfoGerman.getInfoPrinter,
    infoRecoveryPrinter: vacInfoGerman.getInfoPrinter
  }
};

export const defaultPrinter: IPrintersForLanguage =
  printersConfigurations[PreferredLanguageEnum.en_GB];

/**
 * Return the correct IPrintersForLanguage based on preferred language,
 * or default IPrintersForLanguage if no language is selected
 *
 * @param lang the preferred language, if any
 * @returns
 */
export const getPrinterForLanguage = (
  lang: o.Option<PreferredLanguage>
): IPrintersForLanguage =>
  pipe(
    lang,
    o.chain(l =>
      o.fromNullable(
        (printersConfigurations as Record<
          PreferredLanguage,
          IPrintersForLanguage
        >)[l]
      )
    ),
    o.getOrElse(() => defaultPrinter)
  );

/**
 * Returns the Detail markdown filled with data from the input Certificate
 * based on preferred language and the Certificate type (vac, test, rec)
 *
 * @param lang the preferred language
 * @param c the Certificate
 * @returns a string containing the Info markdown
 */
export const printDetails = (
  lang: o.Option<PreferredLanguage>,
  c: Certificates
): string =>
  match(c)
    .when(VacCertificate.is, vc =>
      getPrinterForLanguage(lang).detailVaccinePrinter(vc.v[0])
    )
    .when(TestCertificate.is, tc =>
      getPrinterForLanguage(lang).detailTestPrinter(tc.t[0])
    )
    .when(RecoveryCertificate.is, rc =>
      getPrinterForLanguage(lang).detailRecoveryPrinter(rc.r[0])
    )
    .exhaustive();

/**
 * Returns the Info markdown filled with data from the input Certificate
 * based on preferred language
 *
 * @param lang the preferred language
 * @param c the Certificate
 * @returns a string containing the Info markdown
 */
export const printInfo = (
  lang: o.Option<PreferredLanguage>,
  c: Certificates
): string => getPrinterForLanguage(lang).infoVaccinePrinter(c);

/**
 * Returns UVCI of the first certificate (either Vaccination, Test or Recovery)
 *
 * @param _lang the preferred language (unused)
 * @param c the Certificate
 * @returns the UVCI
 */
export const printUvci = (
  _lang: o.Option<PreferredLanguage>,
  c: Certificates
): string =>
  match(c)
    .when(VacCertificate.is, cv => cv.v[0].ci)
    .when(TestCertificate.is, ct => ct.t[0].ci)
    .when(RecoveryCertificate.is, cr => cr.r[0].ci)
    .exhaustive();

/**
 * Returns the markdown info text to be rendered when a Certificate is found to be expired
 * based on preferred language
 *
 * @param lang the preferred language
 * @returns a string containing the Info markdown
 */
export const printExpiredInfo = (lang: o.Option<PreferredLanguage>): string =>
  getPrinterForLanguage(lang).expiredInfoPrinter();

/**
 * Check if Vaccination has ended
 *
 * @param v the VaccinationEntry to check
 * @returns true if process ended, false otherwise
 */
export const isVaccinationProcessEnded = (v: VaccinationEntry): boolean =>
  v.dn >= v.sd; // we may have more doses than the total in case of additional, "booster doses"

/**
 * Test validity in hours, based on type
 *
 * @param v the VaccinationEntry to check
 * @returns the validity of the test, in hours
 */
export const testValidity = (v: TestEntry): string =>
  v.tt === labTestTypes[molecularTest] ? "72" : "48";

/**
 * Format date value based on language
 *
 * @param d the date
 * @param _lang the preferred language
 * @returns a formatted date
 */
export const formatDate = (d: Date, lang: SupportedLanguage): string =>
  pipe(dateFormatForLanguage[lang], format =>
    moment(d)
      .tz(TIME_ZONE)
      .format(format)
  );

/**
 * Format date and time value based on language
 *
 * @param d the date
 * @param _lang the preferred language
 * @returns a formatted date with time
 */
export const formatDateAndTime = (d: Date, lang: SupportedLanguage): string =>
  // eslint-disable-next-line sonarjs/no-identical-functions
  pipe(dateAndTimeFormatForLanguage[lang], format =>
    moment(d)
      .tz(TIME_ZONE)
      .format(format)
  );

/**
 * The issuer (is) field value used by Italy Healthcare Department
 */
export const ITALY_HEALTHCARE_ISSUER = "IT";

export const HEALTHCARE_DEP_IT = "Ministero della Salute";
export const HEALTHCARE_DEP_EN = "Ministry of Health";
export const HEALTHCARE_DEP_DE = "Gesundheitsministerium";

const healthcareIssuerForLanguage: { [key in SupportedLanguage]: string } = {
  [PreferredLanguageEnum.it_IT]: HEALTHCARE_DEP_IT,
  [PreferredLanguageEnum.en_GB]: HEALTHCARE_DEP_EN,
  [PreferredLanguageEnum.de_DE]: HEALTHCARE_DEP_DE
};

/**
 * Format Certificate Issuer based on its value and preferred language
 *
 * @param c the issuer certificate value
 * @param _lang the preferred language
 * @returns a formatted Certificate Issuer string
 */
export const formatCertificateIssuer = (
  c: string,
  lang: SupportedLanguage
): string =>
  c !== ITALY_HEALTHCARE_ISSUER ? c : healthcareIssuerForLanguage[lang];
