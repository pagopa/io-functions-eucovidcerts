import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { getFetch } from "@pagopa/ts-commons/lib/agent";
import { getConfigOrThrow } from "../utils/config";
import { createClient } from "../utils/serviceClient";
import { telemetryClientWithContextFactory } from "../utils/appinsights";
import { getSubmitMessageForUserHandler } from "./handler";

const config = getConfigOrThrow();

// Setup Express
const app = express();
secureExpressApp(app);

// Setup Appinsight
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
// const telemetryClient = initTelemetryClient(config) as TelemetryClient;
const telemetryFactory = telemetryClientWithContextFactory(config);

const fetchApi = getFetch(process.env);
const serviceClient = createClient(
  fetchApi,
  config.FNSERVICES_API_URL,
  config.FNSERVICES_API_KEY
);

app.post(
  "/api/v1/messages",
  getSubmitMessageForUserHandler(serviceClient, telemetryFactory)
);

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
