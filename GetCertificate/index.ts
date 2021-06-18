import { AzureFunction, Context } from "@azure/functions";

import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { initTelemetryClient } from "../utils/appinsights";
import { getConfigOrThrow } from "../utils/config";
import { createDGCClientSelector } from "../utils/dgcClientSelector";
import { getGetCertificateHandler } from "./handler";

const config = getConfigOrThrow();

// Setup Express
const app = express();
secureExpressApp(app);

// Setup Appinsight
initTelemetryClient(config);

const dgcClientSelector = createDGCClientSelector(config, process.env);

// Add express route
app.post("/api/v1/certificate", getGetCertificateHandler(dgcClientSelector));

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
