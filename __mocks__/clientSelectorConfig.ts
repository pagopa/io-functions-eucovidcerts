import * as E from "fp-ts/lib/Either";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { HttpsUrlFromString } from "@pagopa/ts-commons/lib/url";
import { pipe } from "fp-ts/lib/function";
import { IConfig } from "../utils/config";

export const aLoadTestFiscalCode = "AAAAAA00A00A000A" as FiscalCode;
export const aUATFiscalCode = "AAAAAA00A00A000B" as FiscalCode;
export const aPRODFiscalCode = "AAAAAA00A00A000C" as FiscalCode;

export const aLoadTestUrl = "https://example.com/load_test";
export const aUATUrl = "https://example.com/uat";
export const aPRODUrl = "https://example.com/prod";

export const aProdCert = "prod_cert";
export const aProdKey = "prod_key";
export const aProdCA = "prod_ca";
export const aTestCert = "test_cert";
export const aTestKey = "test_key";
export const aTestCA = "test_ca";
export const aUATCert = "uat_cert";
export const aUATKey = "uat_key";
export const aUATCA = "uat_ca";

export const aConfig = ({
  DGC_UAT_CLIENT_CERT: aUATCert,
  DGC_UAT_CLIENT_KEY: aUATKey,
  DGC_UAT_SERVER_CA: aUATCA,
  DGC_LOAD_TEST_CLIENT_CERT: aTestCert,
  DGC_LOAD_TEST_CLIENT_KEY: aTestKey,
  DGC_LOAD_TEST_SERVER_CA: aTestCA,
  DGC_PROD_CLIENT_CERT: aProdCert,
  DGC_PROD_CLIENT_KEY: aProdKey,
  DGC_PROD_SERVER_CA: aProdCA,
  LOAD_TEST_FISCAL_CODES: [aLoadTestFiscalCode],
  DGC_LOAD_TEST_URL: pipe(
    HttpsUrlFromString.decode(aLoadTestUrl),
    E.getOrElseW(() => fail)
  ),
  DGC_UAT_FISCAL_CODES: [aUATFiscalCode],
  DGC_UAT_URL: pipe(
    HttpsUrlFromString.decode(aUATUrl),
    E.getOrElseW(() => fail)
  ),
  DGC_PROD_URL: pipe(
    HttpsUrlFromString.decode(aPRODUrl),
    E.getOrElseW(() => fail)
  )
} as unknown) as IConfig;

export const aProcessEnv: NodeJS.ProcessEnv = {};
