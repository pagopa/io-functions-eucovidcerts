import { Either } from "fp-ts/lib/Either";
import * as e from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";
import * as o from "fp-ts/lib/Option";
import {
  Certificates,
  RecoveryCertificate,
  TestCertificate,
  VacCertificate
} from "./certificate";
import { VALUESET_PLACEHOLDER } from "./valuesets/placeholder";

/**
 * Lists all possible errors (if any) retrieving values
 * from maps for a valid Test Certificate
 */
export const getTestCertificateValidationErrors = (
  te: TestCertificate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalObj: any
): Either<string, Certificates> => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const errors: string[] = [];

  const details = te.t[0];
  const originalDetails = originalObj.t[0];

  // Chech tg
  const checkTG = "tg";
  if (details[checkTG] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `t[0].${checkTG} "${originalDetails[checkTG]}" value not found`
    );
  }

  // Check tt
  const checkTT = "tt";
  if (details[checkTT].displays.en_GB === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `t[0].${checkTT} "${originalDetails[checkTT]}" value not found`
    );
  }

  // Check tr
  const checkTR = "tr";
  if (details[checkTR].displays.en_GB === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `t[0].${checkTR} "${originalDetails[checkTR]}" value not found`
    );
  }

  // Check ma
  const checkMA = "ma";
  if (
    details[checkMA] !== undefined &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isSome(details[checkMA]!) &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (details[checkMA] as o.Some<string>).value === VALUESET_PLACEHOLDER
  ) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `t[0].${checkMA} "${originalDetails[checkMA]}" value not found`
    );
  }

  return errors.length > 0 ? e.left(errors.join(", ")) : e.right(te);
};

/**
 * Lists all possible errors (if any) retrieving values
 * from maps for a valid Vaccination Certificate
 */
export const getVacCertificateValidationErrors = (
  ve: VacCertificate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalObj: any
): Either<string, Certificates> => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const errors: string[] = [];

  const details = ve.v[0];
  const originalDetails = originalObj.v[0];

  // Chech tg
  const checkTG = "tg";
  if (details[checkTG] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `v[0].${checkTG} "${originalDetails[checkTG]}" value not found`
    );
  }

  // Chech vp
  const checkVP = "vp";
  if (details[checkVP] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `v[0].${checkVP} "${originalDetails[checkVP]}" value not found`
    );
  }

  // Chech mp
  const checkMP = "mp";
  if (details[checkMP] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `v[0].${checkMP} "${originalDetails[checkMP]}" value not found`
    );
  }

  // Chech ma
  const checkMA = "ma";
  if (details[checkMA] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `v[0].${checkMA} "${originalDetails[checkMA]}" value not found`
    );
  }

  return errors.length > 0 ? e.left(errors.join(", ")) : e.right(ve);
};

/**
 * Lists all possible errors (if any) retrieving values
 * from maps for a valid Recovery Certificate
 */
export const getRecoveryCertificateValidationErrors = (
  ve: RecoveryCertificate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalObj: any
): Either<string, Certificates> => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const errors: string[] = [];

  const details = ve.r[0];
  const originalDetails = originalObj.r[0];

  // Chech tg
  const checkTG = "tg";
  if (details[checkTG] === VALUESET_PLACEHOLDER) {
    // eslint-disable-next-line functional/immutable-data
    errors.push(
      `v[0].${checkTG} "${originalDetails[checkTG]}" value not found`
    );
  }

  return errors.length > 0 ? e.left(errors.join(", ")) : e.right(ve);
};
