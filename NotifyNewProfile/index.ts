import { AzureFunction } from "@azure/functions";
import { getConfigOrThrow } from "../utils/config";
import { getDGCClientBuilder } from "../utils/dgcClient";
import { NotifyNewProfile } from "./handler";

const config = getConfigOrThrow();

const clientBuilder = getDGCClientBuilder(config, process.env);

const index: AzureFunction = NotifyNewProfile(clientBuilder);

export default index;
