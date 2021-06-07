import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Client as IDGCClient, createClient } from "../generated/dgc/client";
import { IConfig } from "./config";
import { sha256 } from "./conversions";

export type IGetDGCClient = (fiscalCodeHash: NonEmptyString) => IDGCClient;

export const getDGCClientBuilder: (
  config: IConfig,
  fetchApi: typeof fetch
) => IGetDGCClient = (config, fetchApi) => (
  fiscalCodeHash: NonEmptyString
): IDGCClient => {
  if (config.DGC_LOAD_TEST_FISCAL_CODES.map(sha256).includes(fiscalCodeHash)) {
    return createClient({ baseUrl: config.DGC_LOAD_TEST_URL.href, fetchApi });
  }
  if (config.DGC_UAT_FISCAL_CODES.map(sha256).includes(fiscalCodeHash)) {
    return createClient({ baseUrl: config.DGC_UAT_URL.href, fetchApi });
  }
  return createClient({ baseUrl: config.DGC_PROD_URL.href, fetchApi });
};
