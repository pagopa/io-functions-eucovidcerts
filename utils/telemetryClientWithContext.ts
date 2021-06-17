import * as ai from "applicationinsights";
import { TelemetryClient } from "applicationinsights";
import FlushOptions = require("applicationinsights/out/Library/FlushOptions");
import * as l from "lodash";
import { toString } from "lodash";
import * as e from "fp-ts/lib/Either";

export class TelemetryClientWithContext {
  private readonly client: TelemetryClient;
  // eslint-disable-next-line functional/prefer-readonly-type
  private metadata: { [key: string]: unknown };

  constructor(client: TelemetryClient, appName: string) {
    this.client = client;
    this.metadata = { name: appName };
    l.templateSettings.interpolate = /\${([\s\S]+?)}/g; // use delimiter ${}
  }

  // eslint-disable-next-line prettier/prettier
  public trackAvailability(telemetry: ai.Contracts.AvailabilityTelemetry): void {
    return this.client.trackAvailability(telemetry);
  }

  public trackPageView(telemetry: ai.Contracts.PageViewTelemetry): void {
    return this.client.trackPageView(telemetry);
  }

  public trackTrace(telemetry: ai.Contracts.TraceTelemetry): void {
    return this.client.trackTrace(telemetry);
  }

  public trackMetric(telemetry: ai.Contracts.MetricTelemetry): void {
    return this.client.trackMetric(telemetry);
  }
  /**
   * Log an exception
   *
   * @param telemetry      Object encapsulating tracking options
   */
  public trackException(telemetry: ai.Contracts.ExceptionTelemetry): void {
    return this.client.trackException(telemetry);
  }
  /**
   * Log a user action or other occurrence.
   *
   * @param telemetry      Object encapsulating tracking options
   */
  public trackEvent(telemetry: ai.Contracts.EventTelemetry): void {
    return this.client.trackEvent(telemetry);
  }
  /**
   * Log a request. Note that the default client will attempt to collect HTTP requests automatically so only use this for requests
   * that aren't automatically captured or if you've disabled automatic request collection.
   *
   * @param telemetry      Object encapsulating tracking options
   */
  public trackRequest(
    telemetry: ai.Contracts.RequestTelemetry & ai.Contracts.Identified
  ): void {
    return this.client.trackRequest(telemetry);
  }
  /**
   * Log a dependency. Note that the default client will attempt to collect dependencies automatically so only use this for dependencies
   * that aren't automatically captured or if you've disabled automatic dependency collection.
   *
   * @param telemetry      Object encapsulating tracking option
   * */
  public trackDependency(
    telemetry: ai.Contracts.DependencyTelemetry & ai.Contracts.Identified
  ): void {
    return this.client.trackDependency(telemetry);
  }
  /**
   * Immediately send all queued telemetry.
   *
   * @param options Flush options, including indicator whether app is crashing and callback
   */
  public flush(options?: FlushOptions): void {
    return this.client.flush(options);
  }

  public track(
    telemetry: ai.Contracts.Telemetry,
    telemetryType: ai.Contracts.TelemetryType
  ): void {
    return this.client.track(telemetry, telemetryType);
  }

  public setAutoPopulateAzureProperties(value: boolean): void {
    return this.client.setAutoPopulateAzureProperties(value);
  }

  public addTelemetryProcessor(
    telemetryProcessor: (
      envelope: ai.Contracts.EnvelopeTelemetry,
      contextObjects?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly [name: string]: any;
      }
    ) => boolean
  ): void {
    return this.client.addTelemetryProcessor(telemetryProcessor);
  }
  public clearTelemetryProcessors(): void {
    return this.client.clearTelemetryProcessors();
  }

  /**
   * Add the input key-value pair to the metadata and return the value itself.
   *
   * @param key the metadata key
   * @param value the metadata value
   * @returns the input value
   */
  public awareOf<T>(key: string, value: T): T {
    // eslint-disable-next-line functional/immutable-data
    this.metadata[key] = value;
    return value;
  }

  /**
   * Add the input key-value pair to the metadata and return the value itself.
   *
   * @param key the metadata key
   * @param value the metadata value
   * @returns the input value
   */
  public awareOfs(params: { readonly [key: string]: unknown }): void {
    Object.entries(params).forEach(
      // eslint-disable-next-line functional/immutable-data
      entry => (this.metadata[entry[0]] = entry[1])
    );
  }

  public trackEventWithProperties(
    properties: {
      readonly [key: string]: string;
    },
    samplingEnabled: "true" | "false" = "true"
  ): void {
    // eslint-disable-next-line no-console
    console.log(
      "trackEventWithTemplate(properties: " + JSON.stringify(properties) + ")"
    );
    return this.client.trackEvent({
      name: toString(this.metadata.name),
      properties: Object.entries(properties).reduce(
        (prev, curr) => ({
          ...prev,
          [curr[0]]: e
            .tryCatch2v<Error, string | undefined>(
              () => l.template(curr[1])(this.metadata),
              () => Error("")
            )
            .getOrElse("undefined")
        }),
        {}
      ),
      tagOverrides: { samplingEnabled }
    });
  }
}
