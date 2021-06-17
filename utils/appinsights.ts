import * as ai from "applicationinsights";
import { initAppInsights } from "@pagopa/ts-commons/lib/appinsights";
import { IConfig } from "./config";

// Avoid to initialize Application Insights more than once
export const initTelemetryClient = (
  env: IConfig
): ai.TelemetryClient | ReturnType<typeof initAppInsights> =>
  ai.defaultClient
    ? ai.defaultClient
    : initAppInsights(env.APPINSIGHTS_INSTRUMENTATIONKEY, {
        disableAppInsights: env.APPINSIGHTS_DISABLE === "true",
        samplingPercentage: env.APPINSIGHTS_SAMPLING_PERCENTAGE
      });
