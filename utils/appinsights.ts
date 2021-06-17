import * as ai from "applicationinsights";
import { initAppInsights } from "@pagopa/ts-commons/lib/appinsights";
import { TelemetryClient } from "applicationinsights";
import { IConfig } from "./config";
import { TelemetryClientWithContext } from "./telemetryClientWithContext";

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
export class TelemetryClientWithContextFactory {
  private readonly client: TelemetryClient;
  constructor(env: IConfig) {
    this.client = initTelemetryClient(env) as TelemetryClient; // FIXME align version of "applicationinsights" between eucodivcerts and ts-commons
  }

  public getClientFor(appName: string): TelemetryClientWithContext {
    return new TelemetryClientWithContext(this.client, appName);
  }
}

export const telemetryClientWithContextFactory = (
  env: IConfig
): TelemetryClientWithContextFactory =>
  new TelemetryClientWithContextFactory(env);
