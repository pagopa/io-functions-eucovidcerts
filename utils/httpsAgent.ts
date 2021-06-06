import * as https from "https";
import { getKeepAliveAgentOptions } from "@pagopa/ts-commons/lib/agent";
import nodeFetch from "node-fetch";

export const getFetchWithClientCertificate: (
  env: NodeJS.ProcessEnv,
  clientCertPrefix: string
) => typeof fetch = (env, clientCertPrefix) => {
  const httpsAgent = new https.Agent({
    ...getKeepAliveAgentOptions(env),
    cert: env[`${clientCertPrefix}_CLIENT_CERT`],
    key: env[`${clientCertPrefix}_CLIENT_KEY`]
  });

  return (url, init): Promise<Response> => {
    const initWith2WayFetch = {
      ...(init === undefined ? {} : init),
      agent: httpsAgent
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return nodeFetch(url as any, initWith2WayFetch as any) as any;
  };
};
