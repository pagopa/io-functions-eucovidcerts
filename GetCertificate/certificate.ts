/* eslint-disable sort-keys */
/**
 * Certificate parsing utilities
 */
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import * as t from "io-ts";
import { WithinRangeInteger } from "@pagopa/ts-commons/lib/numbers";
import { DateFromString } from "@pagopa/ts-commons/lib/dates";
import { toTWithMap, toTWithMapOptional } from "../utils/conversions";
import { diseaseAgentTargeted } from "./valuesets/diseaseAgentTargeted";
import { vaccineProphylaxis } from "./valuesets/vaccineProphylaxis";
import { vaccineMedicinalProduct } from "./valuesets/vaccineMedicinalProduct";
import { marketingAuthorizationHolder } from "./valuesets/marketingAuthorizationHolders";
import { labTestTypes } from "./valuesets/labTestTypes";
import { labTestManufactorers } from "./valuesets/labTestManufactorers";
import { testResults } from "./valuesets/testResults";

const PLACEHOLDER_KEY = "placeholder";

type PersonName = t.TypeOf<typeof PersonName>;
const PersonName = t.interface({
  fn: t.string, // Familiy Name
  fnt: NonEmptyString, // Standardized Family Name
  gn: t.string, // Given Name
  gnt: t.string // Standardized Given Name
});

// *************************
// Entries
// *************************

export type VaccinationEntry = t.TypeOf<typeof VaccinationEntry>;
export const VaccinationEntry = t.interface({
  tg: t.string.pipe(toTWithMap(diseaseAgentTargeted, PLACEHOLDER_KEY)), // disease or agent targeted
  vp: t.string.pipe(toTWithMap(vaccineProphylaxis, PLACEHOLDER_KEY)), // vaccine or prophylaxis
  mp: t.string.pipe(toTWithMap(vaccineMedicinalProduct, PLACEHOLDER_KEY)), // vaccine medicinal product
  ma: t.string.pipe(toTWithMap(marketingAuthorizationHolder, PLACEHOLDER_KEY)), // Marketing Authorization Holder
  dn: WithinRangeInteger(1, 9), // Dose Number
  sd: WithinRangeInteger(1, 9), // Total Series of Doses
  dt: DateFromString, // Date of Vaccination
  co: NonEmptyString, // Country of Vaccination
  is: NonEmptyString, // Certificate Issuer
  ci: NonEmptyString // Unique Certificate Identifier: UVCI
});

export type TestEntry = t.TypeOf<typeof TestEntry>;
export const TestEntry = t.intersection([
  t.interface({
    tg: t.string.pipe(toTWithMap(diseaseAgentTargeted, PLACEHOLDER_KEY)), // disease or agent targeted
    tt: t.string.pipe(toTWithMap(labTestTypes, PLACEHOLDER_KEY)), // covid-19 Lab Test Types
    sc: DateFromString, // Date/Time of Sample Collection
    tr: t.string.pipe(toTWithMap(testResults, PLACEHOLDER_KEY)), // Test Result
    tc: t.string, // Testing Centre
    co: t.string, // Country of Test
    is: t.string, // Issuer
    ci: t.string // Unique Certificate Identifier: UVCI
  }),
  t.partial({
    nm: t.string, // test name
    dr: DateFromString, // Date/Time of Test Result
    ma: t.string.pipe(toTWithMapOptional(labTestManufactorers, PLACEHOLDER_KEY)) // lab test manufactorers
  })
]);

export type RecoveryEntry = t.TypeOf<typeof RecoveryEntry>;
export const RecoveryEntry = t.intersection([
  t.interface({
    tg: t.string.pipe(toTWithMap(diseaseAgentTargeted, PLACEHOLDER_KEY)), // disease or agent targeted
    fr: DateFromString, // ISO 8601 Date of First Positive Test Result
    co: t.string, // Country of Test
    is: t.string, // Certificate Issuer
    df: DateFromString, // ISO 8601 Date: Certificate Valid From
    du: DateFromString, // ISO 8601 Date: Certificate Valid Until
    ci: t.string // Unique Certificate Identifier: UVCI
  }),
  t.partial({})
]);

export type ExemptionEntry = t.TypeOf<typeof ExemptionEntry>;
export const ExemptionEntry = t.intersection([
  t.interface({
    tg: t.string.pipe(toTWithMap(diseaseAgentTargeted, PLACEHOLDER_KEY)), // disease or agent targeted
    fc: t.string, // Unique identifier of the certifying doctor (Codice Fiscale)
    co: t.string, // Country of Test
    is: t.string, // Certificate Issuer
    df: DateFromString, // ISO 8601 Date: Certificate Valid From
    ci: t.string, // Unique Certificate Identifier: UVCI
    cu: t.string // Unique vaccination exemption code: CUEV
  }),
  t.partial({
    du: DateFromString // ISO 8601 Date: Certificate Valid Until
  })
]);

// *************************
// Certificates
// *************************

export type VacCertificate = t.TypeOf<typeof VacCertificate>;
export const VacCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  v: t.readonlyArray<typeof VaccinationEntry>(VaccinationEntry)
});

export type TestCertificate = t.TypeOf<typeof TestCertificate>;
export const TestCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  t: t.readonlyArray<typeof TestEntry>(TestEntry)
});

export type RecoveryCertificate = t.TypeOf<typeof RecoveryCertificate>;
export const RecoveryCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  r: t.readonlyArray<typeof RecoveryEntry>(RecoveryEntry)
});

export type ExemptionCertificate = t.TypeOf<typeof ExemptionCertificate>;
export const ExemptionCertificate = t.interface({
  ver: NonEmptyString,
  nam: PersonName,
  dob: DateFromString,
  e: t.readonlyArray<typeof ExemptionEntry>(ExemptionEntry)
});

export type Certificates = t.TypeOf<typeof Certificates>;
export const Certificates = t.union([
  VacCertificate,
  TestCertificate,
  RecoveryCertificate,
  ExemptionCertificate
]);

export type ItalianValidityOnlyCertificates = t.TypeOf<
  typeof ItalianValidityOnlyCertificates
>;
export const ItalianValidityOnlyCertificates = ExemptionCertificate;
