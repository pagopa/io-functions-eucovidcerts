import { AzureFunction } from "@azure/functions";
import { getConfigOrThrow } from "../utils/config";
import { createDGCClientSelector } from "../utils/dgcClientSelector";
import { NotifyNewProfile } from "./handler";

const config = getConfigOrThrow();

const clientBuilder = createDGCClientSelector(config, process.env);

const index: AzureFunction = NotifyNewProfile(clientBuilder);

export default index;
