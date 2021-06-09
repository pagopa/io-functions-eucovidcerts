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

export const getPrinterForLanguage = (
  lang: o.Option<PreferredLanguage>
): IPrintersForLanguage =>
  lang
    .chain(l => o.fromNullable(printersConfigurations.get(l)))
    .getOrElse(defaultPrinter);

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

export const printInfo = (
  lang: o.Option<PreferredLanguage>,
  c: Certificates
): string => getPrinterForLanguage(lang).infoVaccinePrinter(c);

export const printUvci = (
  _lang: o.Option<PreferredLanguage>,
  c: Certificates
): string =>
  match(c)
    .when(VacCertificate.is, cv => cv.v[0].ci)
    .when(TestCertificate.is, ct => ct.t[0].ci)
    .when(RecoveryCertificate.is, cr => cr.r[0].ci)
    .exhaustive(); // TODO

export const isVaccinationProcessEnded = (v: VaccinationEntry): boolean =>
  v.dn === v.sd;

export const formatDate = (d: Date, _lang: PreferredLanguage): string =>
  match(_lang)
    .when(
      l => l === PreferredLanguageEnum.en_GB,
      _ => moment(d).format(DATE_FORMAT_EN)
    )
    .otherwise(() => moment(d).format(DATE_FORMAT_ITA));
