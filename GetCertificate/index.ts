import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { clients } from "../utils/dgc";
import { getGetCertificateHandler } from "./handler";

// Setup Express
const app = express();
secureExpressApp(app);

// Add express route
app.get(
  "/api/v1/certificate",
  getGetCertificateHandler(
    /* TODO: switch client based on provided fiscal code */ clients.PROD
  )
);

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
