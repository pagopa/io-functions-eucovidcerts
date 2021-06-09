/* eslint-disable sort-keys */
/**
 * Certificate parsing utilities
 */
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Either, left } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { WithinRangeInteger } from "@pagopa/ts-commons/lib/numbers";
import { DateFromString } from "@pagopa/ts-commons/lib/dates";
import { toTWithMap } from "../utils/conversions";
import { diseaseAgentTargeted } from "./valuesets/diseaseAgentTargeted";
import { vaccineProphylaxis } from "./valuesets/vaccineProphylaxis";
import { vaccineMedicinalProduct } from "./valuesets/vaccineMedicinalProduct";
import { marketingAuthorizationHolder } from "./valuesets/marketingAuthorizationHolders";
import { labTestTypes } from "./valuesets/labTestTypes";
import { labTestManufactorers } from "./valuesets/labTestManufactorers";
import { testResults } from "./valuesets/testResults";

type PersonName = t.TypeOf<typeof PersonName>;
const PersonName = t.interface({
  fn: t.string, // Familiy Name
  fnt: NonEmptyString, // Standardized Family Name
  gn: t.string, // Given Name
  gnt: t.string // Standardized Given Name
});

export type VaccinationEntry = t.TypeOf<typeof VaccinationEntry>;
export const VaccinationEntry = t.interface({
  tg: t.string.pipe(toTWithMap(diseaseAgentTargeted)), // disease or agent targeted
  vp: t.string.pipe(toTWithMap(vaccineProphylaxis)), // vaccine or prophylaxis
  mp: t.string.pipe(toTWithMap(vaccineMedicinalProduct)), // vaccine medicinal product
  ma: t.string.pipe(toTWithMap(marketingAuthorizationHolder)), // Marketing Authorization Holder
  dn: WithinRangeInteger(1, 9), // Dose Number
  sd: WithinRangeInteger(1, 9), // Total Series of Doses
  dt: DateFromString, // Date of Vaccination
  co: NonEmptyString, // Country of Vaccination
  is: NonEmptyString, // Certificate Issuer
  ci: NonEmptyString // Unique Certificate Identifier: UVCI
});

export type TestEntry = t.TypeOf<typeof TestEntry>;
export const TestEntry = t.interface({
  tg: t.string.pipe(toTWithMap(diseaseAgentTargeted)), // disease or agent targeted
  tt: t.string.pipe(toTWithMap(labTestTypes)), // covid-19 Lab Test Types
  nm: t.string, // test name
  ma: t.string.pipe(toTWithMap(labTestManufactorers)), // covid-19 Lab Test Manufactorers
  sc: DateFromString, // Date/Time of Sample Collection
  dr: DateFromString, // Date/Time of Test Result
  tr: t.string.pipe(toTWithMap(testResults)), // Test Result
  tc: t.string, // Testing Centre
  co: t.string, // Country of Test
  is: t.string, // Issuer
  ci: t.string // Issuer
});

export const VacCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  v: t.readonlyArray<typeof VaccinationEntry>(VaccinationEntry)
});
export const TestCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  t: t.readonlyArray<typeof TestEntry>(TestEntry)
});
export const RecoveryCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  r: t.readonlyArray<typeof TestEntry>(TestEntry) // TODO
});

export type Certificates = t.TypeOf<typeof Certificates>;
export const Certificates = t.union([
  VacCertificate,
  TestCertificate,
  RecoveryCertificate
]);

/**
 * Parse a given base64 string representing a qrcode image to extract Certificate's informations
 *
 * @param qrcode
 * @returns either the Certificate object or a parsing error message
 */
export const parseQRCode = (_qrcode: string): Either<string, Certificates> =>
  left(`QRCode parsing not yet implemented`);
