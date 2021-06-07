import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Client as IDGCClient, createClient } from "../generated/dgc/client";
import { IConfig } from "./config";
import { sha256 } from "./conversions";
import { DGCEnvironment, getFetchWithClientCertificate } from "./httpsAgent";

export type IGetDGCClient = (fiscalCodeHash: NonEmptyString) => IDGCClient;

export const getDGCClientBuilder: (
  config: IConfig,
  env: NodeJS.ProcessEnv
) => IGetDGCClient = (config, env) => (
  fiscalCodeHash: NonEmptyString
): IDGCClient => {
  if (config.DGC_LOAD_TEST_FISCAL_CODES.map(sha256).includes(fiscalCodeHash)) {
    return createClient({
      baseUrl: config.DGC_LOAD_TEST_URL.href,
      fetchApi: getFetchWithClientCertificate(env, DGCEnvironment.LOAD_TEST)
    });
  }
  if (config.DGC_UAT_FISCAL_CODES.map(sha256).includes(fiscalCodeHash)) {
    return createClient({
      baseUrl: config.DGC_UAT_URL.href,
      fetchApi: getFetchWithClientCertificate(env, DGCEnvironment.UAT)
    });
  }
  return createClient({
    baseUrl: config.DGC_PROD_URL.href,
    fetchApi: getFetchWithClientCertificate(env, DGCEnvironment.PROD)
  });
};
