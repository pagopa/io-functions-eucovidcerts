import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { getConfigOrThrow } from "../utils/config";
import { createClient } from "../utils/serviceClient";
import { getSubmitMessageForUserHandler } from "./handler";

// Setup Express
const app = express();
secureExpressApp(app);

const config = getConfigOrThrow();
const serviceClient = createClient(
  config.FNSERVICES_API_URL,
  config.FNSERVICES_API_KEY
);

app.post("/api/v1/messages", getSubmitMessageForUserHandler(serviceClient));

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
