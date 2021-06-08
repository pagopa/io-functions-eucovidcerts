import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { toString } from "fp-ts/lib/function";
import {
  Certificates,
  TestCertificate,
  VacCertificate,
  VaccinationEntry
} from "./certificate";
import * as vacDetailsEn from "./markdown files/eucovidcertDetailsVaccinationEn";
import * as vacDetailsIt from "./markdown files/eucovidcertDetailsVaccinationIt";
import * as testDetailsIt from "./markdown files/eucovidcertDetailsTestIt";
import * as testDetailsEn from "./markdown files/eucovidcertDetailsTestEn";
import * as infoEn from "./markdown files/eucovidcertInfoVaccinationEn";
import * as infoIt from "./markdown files/eucovidcertInfoVaccinationIt";

const assertNever = (x: never): never => {
  throw new Error(`Unexpected object: ${toString(x)}`);
};

/**
 * Signature of a function that creates a text from a Certificate object
 */
export type CertificatePrinter = (e: Certificates) => string;

export const createDetailsPrinter = (
  lang: PreferredLanguage
): CertificatePrinter => (e: Certificates): string => {
  // the first certificate in the QR Code will be used to compile the markdown. The others will be ignored.

  if (VacCertificate.is(e)) {
    const certificate = e.v[0];
    switch (lang) {
      case PreferredLanguageEnum.it_IT:
        return vacDetailsIt.getDetailPrinter(certificate);
      case PreferredLanguageEnum.en_GB:
      case PreferredLanguageEnum.de_DE:
      case PreferredLanguageEnum.fr_FR:
      case PreferredLanguageEnum.es_ES:
        return vacDetailsEn.getDetailPrinter(certificate);
      default:
        assertNever(lang);
    }
  } else if (TestCertificate.is(e)) {
    const testCertificate = e.t[0];
    switch (lang) {
      case PreferredLanguageEnum.it_IT:
        return testDetailsIt.getDetailPrinter(testCertificate);
      case PreferredLanguageEnum.en_GB:
      case PreferredLanguageEnum.de_DE:
      case PreferredLanguageEnum.fr_FR:
      case PreferredLanguageEnum.es_ES:
        return testDetailsEn.getDetailPrinter(testCertificate);
      default:
        assertNever(lang);
    }
  }
  throw Error("No markdown generator found for current certificate");
};

export const createInfoPrinter = (
  lang: PreferredLanguage
): CertificatePrinter => (e: Certificates): string => {
  // the first certificate in the QR Code will be used to compile the markdown. The others will be ignored.

  if (VacCertificate.is(e)) {
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
  }

  throw Error("No markdown generator found for current certificate");
};

export const isVaccinationProcessEnded = (v: VaccinationEntry): boolean =>
  v.dn === v.sd;

export const formatDate = (d: Date, _lang: PreferredLanguage): string =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`;
