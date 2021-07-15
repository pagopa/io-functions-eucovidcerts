import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { AzureFunction, Context } from "@azure/functions";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";

export const setupAzureFunctionEndpoint = (
  setupEnpoint: (app: express.Express) => void
): AzureFunction => {
  // Setup Express
  const app = express();
  secureExpressApp(app);

  setupEnpoint(app);

  const azureFunctionHandler = createAzureFunctionHandler(app);

  return (context: Context): void => {
    setAppContext(app, context);
    azureFunctionHandler(context);
  };
};
