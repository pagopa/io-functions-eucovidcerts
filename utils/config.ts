/**
 * Config module
 *
 * Single point of access for the application confguration. Handles validation on required environment variables.
 * The configuration is evaluate eagerly at the first access to the module. The module exposes convenient methods to access such value.
 */

import * as t from "io-ts";
import { ValidationError } from "io-ts";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { HttpsUrlFromString } from "@pagopa/ts-commons/lib/url";
import { CommaSeparatedListOf } from "./comma-separated-list";
import { StringFromBase64 } from "./conversions";

const DCGConfigPROD = t.interface({
  DGC_PROD_CLIENT_CERT: t.string.pipe(StringFromBase64).pipe(NonEmptyString),
  DGC_PROD_CLIENT_KEY: t.string.pipe(StringFromBase64).pipe(NonEmptyString),
  DGC_PROD_URL: HttpsUrlFromString
});

const DCGConfigUAT = t.interface({
  DGC_UAT_CLIENT_CERT: t.string.pipe(StringFromBase64).pipe(NonEmptyString),
  DGC_UAT_CLIENT_KEY: t.string.pipe(StringFromBase64).pipe(NonEmptyString),
  DGC_UAT_FISCAL_CODES: CommaSeparatedListOf(FiscalCode),
  DGC_UAT_URL: HttpsUrlFromString
});

const DCGConfigLOAD = t.interface({
  DGC_LOAD_TEST_CLIENT_CERT: t.string
    .pipe(StringFromBase64)
    .pipe(NonEmptyString),
  DGC_LOAD_TEST_CLIENT_KEY: t.string
    .pipe(StringFromBase64)
    .pipe(NonEmptyString),
  DGC_LOAD_TEST_URL: HttpsUrlFromString,
  LOAD_TEST_FISCAL_CODES: CommaSeparatedListOf(FiscalCode)
});

// global app configuration
export type IConfig = t.TypeOf<typeof IConfig>;
// eslint-disable-next-line @typescript-eslint/ban-types
export const IConfig = t.intersection([
  DCGConfigPROD,
  DCGConfigUAT,
  DCGConfigLOAD,
  t.interface({
    FNSERVICES_API_KEY: NonEmptyString,
    FNSERVICES_API_URL: NonEmptyString,
    isProduction: t.boolean
  })
]);

// No need to re-evaluate this object for each call
const errorOrConfig: t.Validation<IConfig> = IConfig.decode({
  ...process.env,
  isProduction: process.env.NODE_ENV === "production"
});

/**
 * Read the application configuration and check for invalid values.
 * Configuration is eagerly evalued when the application starts.
 *
 * @returns either the configuration values or a list of validation errors
 */
export const getConfig = (): t.Validation<IConfig> => errorOrConfig;

/**
 * Read the application configuration and check for invalid values.
 * If the application is not valid, raises an exception.
 *
 * @returns the configuration values
 * @throws validation errors found while parsing the application configuration
 */
export const getConfigOrThrow = (): IConfig =>
  errorOrConfig.getOrElseL((errors: ReadonlyArray<ValidationError>) => {
    throw new Error(`Invalid configuration: ${readableReport(errors)}`);
  });
