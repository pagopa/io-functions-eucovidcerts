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
  RecoveryCertificate
} from "./certificate";

const DATE_FORMAT_EN = "YYYY-MM-DD";
const DATE_FORMAT_ITA = "DD-MM-YYYY";

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
 * Returns UVCI of the first certificate (either Vaccination, Test or Recovery)
 *
 * @param _lang the preferred language (unused)
 * @param c the Certificate
 * @returns the UVCI
 */
export const formatUvci = (uvci: string): string => uvci;

// NOTE: This will be used if we need to split in two lines
// pipe(
//   uvci,
//   _ => [_.substring(0, _.length / 2), _.substring(_.length / 2, _.length)],
//   substrings => `${substrings[0]}  \n${substrings[1]}`
// );

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
