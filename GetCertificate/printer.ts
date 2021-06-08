import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { toString } from "fp-ts/lib/function";
import { ParsedCertificate, VaccinationEntry } from "./certificate";
import * as detailsEn from "./markdown files/eucovidcertDetailsVaccinationEn";
import * as detailsIt from "./markdown files/eucovidcertDetailsVaccinationIt";
import * as infoEn from "./markdown files/eucovidcertInfoVaccinationEn";
import * as infoIt from "./markdown files/eucovidcertInfoVaccinationIt";

const assertNever = (x: never): never => {
  throw new Error(`Unexpected object: ${toString(x)}`);
};

/**
 * Signature of a function that creates a text from a Certificate object
 */
export type CertificatePrinter = (e: ParsedCertificate) => string;

export const createDetailsPrinter = (
  lang: PreferredLanguage
): CertificatePrinter => (e: ParsedCertificate): string => {
  // the first certificate in the QR Code will be used to compile the markdown. The others will be ignored.
  const certificate = e.v[0];
  switch (lang) {
    case PreferredLanguageEnum.it_IT:
      return detailsIt.getDetailPrinter(certificate);
    case PreferredLanguageEnum.en_GB:
    case PreferredLanguageEnum.de_DE:
    case PreferredLanguageEnum.fr_FR:
    case PreferredLanguageEnum.es_ES:
      return detailsEn.getDetailPrinter(certificate);
    default:
      assertNever(lang);
  }
  return detailsEn.getDetailPrinter(certificate);
};

export const createInfoPrinter = (
  lang: PreferredLanguage
): CertificatePrinter => (e: ParsedCertificate): string => {
  // the first certificate in the QR Code will be used to compile the markdown. The others will be ignored.
  const certificate = e.v[0];
  switch (lang) {
    case PreferredLanguageEnum.it_IT:
      return infoIt.getInfoPrinter(certificate);
    case PreferredLanguageEnum.en_GB:
    case PreferredLanguageEnum.de_DE:
    case PreferredLanguageEnum.fr_FR:
    case PreferredLanguageEnum.es_ES:
      return infoEn.getInfoPrinter(certificate);
    default:
      assertNever(lang);
  }
  return infoEn.getInfoPrinter(certificate);
};

export const isVaccinationProcessEnded = (v: VaccinationEntry): boolean =>
  v.dn === v.sd;

export const formatDate = (d: Date, _lang: PreferredLanguage): string =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`;
