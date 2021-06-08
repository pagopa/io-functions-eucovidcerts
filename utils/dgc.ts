import { createClient as createDGCClient } from "../generated/dgc/client";

import { getConfigOrThrow } from "./config";
import { getFetchWithClientCertificate } from "./httpsAgent";

const config = getConfigOrThrow();

/**
 * A set of clients to interact with different DGC environments
 */
export const clients = {
  LOAD: createDGCClient({
    baseUrl: config.DGC_LOAD_TEST_URL.href,
    fetchApi: getFetchWithClientCertificate(
      process.env,
      config.DGC_LOAD_TEST_CLIENT_CERT,
      config.DGC_LOAD_TEST_CLIENT_KEY,
      config.DGC_LOAD_TEST_SERVER_CA
    )
  }),
  PROD: createDGCClient({
    baseUrl: config.DGC_PROD_URL.href,
    fetchApi: getFetchWithClientCertificate(
      process.env,
      config.DGC_PROD_CLIENT_CERT,
      config.DGC_PROD_CLIENT_KEY,
      config.DGC_PROD_SERVER_CA
    )
  }),
  UAT: createDGCClient({
    baseUrl: config.DGC_UAT_URL.href,
    fetchApi: getFetchWithClientCertificate(
      process.env,
      config.DGC_UAT_CLIENT_CERT,
      config.DGC_UAT_CLIENT_KEY,
      config.DGC_UAT_SERVER_CA
    )
  })
};
