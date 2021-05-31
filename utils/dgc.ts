import { agent } from "@pagopa/ts-commons/";
import {
  AbortableFetch,
  setFetchTimeout,
  toFetch
} from "@pagopa/ts-commons/lib/fetch";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import nodeFetch from "node-fetch";
import { createClient as createDGCClient } from "../generated/dgc/client";

import { getConfigOrThrow } from "./config";

const config = getConfigOrThrow();

// 5 seconds timeout by default
const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

// Must be an https endpoint so we use an https agent
const abortableFetch = AbortableFetch(agent.getHttpFetch(process.env));
const fetchWithTimeout = toFetch(
  setFetchTimeout(DEFAULT_REQUEST_TIMEOUT_MS as Millisecond, abortableFetch)
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchApi: typeof fetchWithTimeout = (nodeFetch as any) as typeof fetchWithTimeout;

/**
 * A set of clients to interact with different DGC environments
 */
export const clients = {
  LOAD: undefined, // TODO
  PROD: createDGCClient({
    baseUrl: config.DGC_HOST,
    fetchApi
  }),
  UAT: undefined // TODO
};
