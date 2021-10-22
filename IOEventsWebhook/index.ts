import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { IOEventsWebhook } from "./handler";

// Setup Express
const app = express();
secureExpressApp(app);

// Add express route
app.post("/api/v1/io-events-webhook", IOEventsWebhook());

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
