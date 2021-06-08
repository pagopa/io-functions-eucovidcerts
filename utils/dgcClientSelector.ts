import { Client as DGCClient, createClient } from "../generated/dgc/client";
import { IConfig } from "./config";
import { toSHA256 } from "./conversions";
import { getFetchWithClientCertificate } from "./httpsAgent";

/**
 * Defines a selector object of a type T.
 * A selector returns different implementations of T depending on the value of the fiscal code provided
 */
interface ISelector<T> {
  readonly select: (hashedFiscalCode: string) => T;
}

/**
 * Build a selector object for DGC https client
 *
 * @param config Function configuration
 * @param env NodeJS process env variables
 * @returns
 */
export const createDGCClientSelector = (
  {
    DGC_UAT_SERVER_CA,
    DGC_UAT_CLIENT_CERT,
    DGC_UAT_CLIENT_KEY,
    DGC_UAT_FISCAL_CODES,
    DGC_UAT_URL,
    DGC_LOAD_TEST_SERVER_CA,
    DGC_LOAD_TEST_CLIENT_CERT,
    DGC_LOAD_TEST_CLIENT_KEY,
    LOAD_TEST_FISCAL_CODES,
    DGC_LOAD_TEST_URL,
    DGC_PROD_SERVER_CA,
    DGC_PROD_CLIENT_CERT,
    DGC_PROD_CLIENT_KEY,
    DGC_PROD_URL
  }: IConfig,
  env: NodeJS.ProcessEnv
): ISelector<DGCClient> => {
  // calculate hashes in advance
  const hashedUATFiscalCodes = DGC_UAT_FISCAL_CODES.map(toSHA256);
  const hashedLoadTestFiscalCodes = LOAD_TEST_FISCAL_CODES.map(toSHA256);

  const prodClient = createClient({
    basePath: "",
    baseUrl: DGC_PROD_URL.href,
    fetchApi: getFetchWithClientCertificate(
      env,
      DGC_PROD_CLIENT_CERT,
      DGC_PROD_CLIENT_KEY,
      DGC_PROD_SERVER_CA
    )
  });
  const uatClient = createClient({
    basePath: "",
    baseUrl: DGC_UAT_URL.href,
    fetchApi: getFetchWithClientCertificate(
      env,
      DGC_UAT_CLIENT_CERT,
      DGC_UAT_CLIENT_KEY,
      DGC_UAT_SERVER_CA
    )
  });
  const loadTestClient = createClient({
    basePath: "",
    baseUrl: DGC_LOAD_TEST_URL.href,
    fetchApi: getFetchWithClientCertificate(
      env,
      DGC_LOAD_TEST_CLIENT_CERT,
      DGC_LOAD_TEST_CLIENT_KEY,
      DGC_LOAD_TEST_SERVER_CA
    )
  });

  return {
    select: (hashedFiscalCode): DGCClient =>
      hashedUATFiscalCodes.includes(hashedFiscalCode)
        ? uatClient
        : hashedLoadTestFiscalCodes.includes(hashedFiscalCode)
        ? loadTestClient
        : prodClient
  };
};
