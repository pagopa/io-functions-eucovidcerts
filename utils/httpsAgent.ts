import * as https from "https";
import { getKeepAliveAgentOptions } from "@pagopa/ts-commons/lib/agent";
import nodeFetch from "node-fetch";

export const getFetchWithClientCertificate = (
  env: NodeJS.ProcessEnv,
  cert: string,
  key: string
): typeof fetch => {
  const httpsAgent = new https.Agent({
    ...getKeepAliveAgentOptions(env),
    cert,
    key
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
