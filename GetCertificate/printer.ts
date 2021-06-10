/* eslint-disable sort-keys */
import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import * as o from "fp-ts/lib/Option";
import * as moment from "moment";
import { match } from "ts-pattern";
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
import * as testDetailsIt from "./markdown/eucovidcertDetailsTestIt";
import * as testDetailsEn from "./markdown/eucovidcertDetailsTestEn";
import * as recoveryDetailsIt from "./markdown/eucovidcertDetailsRecoveryIt";
import * as recoveryDetailsEn from "./markdown/eucovidcertDetailsRecoveryEn";
import * as vacInfoEn from "./markdown/eucovidcertInfoVaccinationEn";

const DATE_FORMAT_EN = "YYYY-MM-DD";
const DATE_FORMAT_ITA = "DD-MM-YYYY";

interface IPrintersForLanguage {
  readonly detailVaccinePrinter: (v: VaccinationEntry) => string;
  readonly detailTestPrinter: (t: TestEntry) => string;
  readonly detailRecoveryPrinter: (r: RecoveryEntry) => string;
  readonly infoVaccinePrinter: (c: Certificates) => string;
  readonly infoTestPrinter: (c: Certificates) => string;
  readonly infoRecoveryPrinter: (c: Certificates) => string;
}

const printersConfigurations = new Map<PreferredLanguage, IPrintersForLanguage>(
  [
    [
      PreferredLanguageEnum.it_IT,
      {
        detailVaccinePrinter: vacDetailsIt.getDetailPrinter,
        detailTestPrinter: testDetailsIt.getDetailPrinter,
        detailRecoveryPrinter: recoveryDetailsIt.getDetailPrinter,
        infoVaccinePrinter: vacInfoEn.getInfoPrinter,
        infoTestPrinter: vacInfoEn.getInfoPrinter,
        infoRecoveryPrinter: vacInfoEn.getInfoPrinter
      }
    ],
    [
      PreferredLanguageEnum.en_GB,
      {
        detailVaccinePrinter: vacDetailsEn.getDetailPrinter,
        detailTestPrinter: testDetailsEn.getDetailPrinter,
        detailRecoveryPrinter: recoveryDetailsEn.getDetailPrinter,
        infoVaccinePrinter: vacInfoEn.getInfoPrinter,
        infoTestPrinter: vacInfoEn.getInfoPrinter,
        infoRecoveryPrinter: vacInfoEn.getInfoPrinter
      }
    ]
  ]
);

export const defaultPrinter: IPrintersForLanguage = {
  detailVaccinePrinter: vacDetailsEn.getDetailPrinter,
  detailTestPrinter: testDetailsEn.getDetailPrinter,
  detailRecoveryPrinter: recoveryDetailsEn.getDetailPrinter,
  infoVaccinePrinter: vacInfoEn.getInfoPrinter,
  infoTestPrinter: vacInfoEn.getInfoPrinter,
  infoRecoveryPrinter: vacInfoEn.getInfoPrinter
};

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
  lang
    .chain(l => o.fromNullable(printersConfigurations.get(l)))
    .getOrElse(defaultPrinter);

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
    .exhaustive(); // TODO

/**
 * Check if Vaccination has ended
 *
 * @param v the VaccinationEntry to check
 * @returns true if process ended, false otherwise
 */
export const isVaccinationProcessEnded = (v: VaccinationEntry): boolean =>
  v.dn === v.sd;

/**
 * Format date value based on language
 *
 * @param d the date
 * @param _lang the preferred language
 * @returns a formatted date
 */
export const formatDate = (d: Date, _lang: PreferredLanguage): string =>
  match(_lang)
    .when(
      l => l === PreferredLanguageEnum.en_GB,
      _ => moment(d).format(DATE_FORMAT_EN)
    )
    .otherwise(() => moment(d).format(DATE_FORMAT_ITA));

/**
 * The issuer (is) field value used by Italy Healthcare Department
 */
export const ITALY_HEALTHCARE_ISSUER = "IT";
export const HEALTHCARE_DEP_IT = "Ministero della Salute";
export const HEALTHCARE_DEP_EN = "Ministry of Health";

/**
 * Format Certificate Issuer based on its value and preferred language
 *
 * @param c the issuer certificate value
 * @param _lang the preferred language
 * @returns a formatted Certificate Issuer string
 */
export const formatCertificateIssuer = (
  c: string,
  lang: PreferredLanguage
): string =>
  c !== ITALY_HEALTHCARE_ISSUER
    ? c
    : match(lang)
        .when(
          l => l === PreferredLanguageEnum.it_IT,
          _ => HEALTHCARE_DEP_IT
        )
        .otherwise(() => HEALTHCARE_DEP_EN);