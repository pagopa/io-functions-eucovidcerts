import { AzureFunction } from "@azure/functions";
import { getFetch } from "@pagopa/ts-commons/lib/agent";
import { getConfigOrThrow } from "../utils/config";
import { getDGCClientBuilder } from "../utils/dgcClient";
import { NotifyNewProfile } from "./handler";

const config = getConfigOrThrow();

const clientBuilder = getDGCClientBuilder(config, getFetch(process.env));

const index: AzureFunction = NotifyNewProfile(clientBuilder);

export default index;
