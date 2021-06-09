/* eslint-disable sort-keys */
import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import * as o from "fp-ts/lib/Option";
import { match } from "ts-pattern";
import {
  Certificates,
  TestCertificate,
  VacCertificate,
  VaccinationEntry,
  TestEntry,
  RecoveryCertificate
} from "./certificate";
import * as vacDetailsEn from "./markdown/eucovidcertDetailsVaccinationEn";
import * as vacDetailsIt from "./markdown/eucovidcertDetailsVaccinationIt";
import * as testDetailsIt from "./markdown/eucovidcertDetailsTestIt";
import * as testDetailsEn from "./markdown/eucovidcertDetailsTestEn";
import * as vacInfoEn from "./markdown/eucovidcertInfoVaccinationEn";
import * as vacInfoIt from "./markdown/eucovidcertInfoVaccinationIt";

// const assertNever = (x: never): never => {
//   throw new Error(`Unexpected object: ${toString(x)}`);
// };

interface IPrintersForLanguage {
  readonly detailVaccinePrinter: (v: VaccinationEntry) => string;
  readonly detailTestPrinter: (t: TestEntry) => string;
  readonly detailRecoveryPrinter: (r: unknown) => string;
  readonly infoVaccinePrinter: (v: VaccinationEntry) => string;
  readonly infoTestPrinter: (t: TestEntry) => string;
  readonly infoRecoveryPrinter: (r: unknown) => string;
}

const printersConfigurations = new Map<PreferredLanguage, IPrintersForLanguage>(
  [
    [
      PreferredLanguageEnum.it_IT,
      {
        detailVaccinePrinter: vacDetailsIt.getDetailPrinter,
        detailTestPrinter: testDetailsIt.getDetailPrinter,
        detailRecoveryPrinter: (): string => "", // TODO
        infoVaccinePrinter: vacInfoIt.getInfoPrinter,
        infoTestPrinter: (): string => "", // TODO
        infoRecoveryPrinter: (): string => "" // TODO
      }
    ],
    [
      PreferredLanguageEnum.en_GB,
      {
        detailVaccinePrinter: vacDetailsEn.getDetailPrinter,
        detailTestPrinter: testDetailsEn.getDetailPrinter,
        detailRecoveryPrinter: (): string => "", // TODO
        infoVaccinePrinter: vacInfoEn.getInfoPrinter,
        infoTestPrinter: (): string => "", // TODO
        infoRecoveryPrinter: (): string => "" // TODO
      }
    ]
  ]
);

export const defaultPrinter: IPrintersForLanguage = {
  detailVaccinePrinter: vacDetailsEn.getDetailPrinter,
  detailTestPrinter: testDetailsEn.getDetailPrinter,
  detailRecoveryPrinter: () => "", // TODO
  infoVaccinePrinter: vacInfoEn.getInfoPrinter,
  infoTestPrinter: () => "", // TODO
  infoRecoveryPrinter: () => "" // TODO
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
): string =>
  match(c)
    .when(VacCertificate.is, vc =>
      getPrinterForLanguage(lang).infoVaccinePrinter(vc.v[0])
    )
    .when(TestCertificate.is, tc =>
      getPrinterForLanguage(lang).infoTestPrinter(tc.t[0])
    )
    .when(RecoveryCertificate.is, rc =>
      getPrinterForLanguage(lang).infoRecoveryPrinter(rc.r[0])
    )
    .exhaustive();

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
  `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`;
