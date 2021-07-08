import { Either } from "fp-ts/lib/Either";
import * as e from "fp-ts/lib/Either";
import { isSome } from "fp-ts/lib/Option";
import * as o from "fp-ts/lib/Option";
import { getSemigroup, NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { sequenceT } from "fp-ts/lib/Apply";
import {
  Certificates,
  RecoveryCertificate,
  TestCertificate,
  VacCertificate
} from "./certificate";
import { VALUESET_PLACEHOLDER } from "./valuesets/placeholder";

const checkIReadableMapValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodedCertificateDetails: any,
  checkProp: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalDetails: any
): Either<NonEmptyArray<string>, string> =>
  decodedCertificateDetails[checkProp] === VALUESET_PLACEHOLDER
    ? e.left(
        new NonEmptyArray<string>(
          `${checkProp} "${originalDetails[checkProp]}" value not found`,
          []
        )
      )
    : e.right(checkProp);

const checkITranslatableMapValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodedCertificateDetails: any,
  checkProp: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalDetails: any
): Either<NonEmptyArray<string>, string> =>
  decodedCertificateDetails[checkProp].displays.en_GB === VALUESET_PLACEHOLDER
    ? e.left(
        new NonEmptyArray<string>(
          `${checkProp} "${originalDetails[checkProp]}" value not found`,
          []
        )
      )
    : e.right(checkProp);

const checkOptionalIReadableMapValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodedCertificateDetails: any,
  checkProp: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalDetails: any
): Either<NonEmptyArray<string>, string> =>
  decodedCertificateDetails[checkProp] !== undefined &&
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  isSome(decodedCertificateDetails[checkProp]!) &&
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (decodedCertificateDetails[checkProp] as o.Some<string>).value ===
    VALUESET_PLACEHOLDER
    ? e.left(
        new NonEmptyArray<string>(
          `${checkProp} "${originalDetails[checkProp]}" value not found`,
          []
        )
      )
    : e.right(checkProp);

/**
 * Lists all possible errors (if any) retrieving values
 * from maps for a valid Test Certificate
 */
export const getTestCertificateValidationErrors = (
  te: TestCertificate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalObj: any
): Either<string, Certificates> => {
  const details = te.t[0];
  const originalDetails = originalObj.t[0];

  const applicativeValidation = e.getValidation(getSemigroup<string>());

  return sequenceT(applicativeValidation)(
    checkIReadableMapValue(details, "tg", originalDetails),
    checkITranslatableMapValue(details, "tt", originalDetails),
    checkITranslatableMapValue(details, "tr", originalDetails),
    checkOptionalIReadableMapValue(details, "ma", originalDetails)
  )
    .map(_ => te)
    .mapLeft(_ => `test details|${_.toArray().join(", ")}`);
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
  const details = ve.v[0];
  const originalDetails = originalObj.v[0];

  const applicativeValidation = e.getValidation(getSemigroup<string>());

  return sequenceT(applicativeValidation)(
    checkIReadableMapValue(details, "tg", originalDetails),
    checkIReadableMapValue(details, "vp", originalDetails),
    checkIReadableMapValue(details, "mp", originalDetails),
    checkIReadableMapValue(details, "ma", originalDetails)
  )
    .map(_ => ve)
    .mapLeft(_ => `vaccination details|${_.toArray().join(", ")}`);
};

/**
 * Lists all possible errors (if any) retrieving values
 * from maps for a valid Recovery Certificate
 */
export const getRecoveryCertificateValidationErrors = (
  rc: RecoveryCertificate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalObj: any
): Either<string, Certificates> => {
  const details = rc.r[0];
  const originalDetails = originalObj.r[0];

  return checkIReadableMapValue(details, "tg", originalDetails)
    .map(_ => rc)
    .mapLeft(_ => `recovery details|${_.toArray().join(", ")}`);
};
