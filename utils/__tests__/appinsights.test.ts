import { Contracts, TelemetryClient } from 'applicationinsights';
import { TelemetryClientWithContext } from '../telemetryClientWithContext';

const dummyTrackEvent: (expectedEvent: Contracts.EventTelemetry) => ((telemetry: Contracts.EventTelemetry) => void) = (expectedEvent) => 
    (telemetry: Contracts.EventTelemetry) => expect(telemetry).toEqual(expectedEvent)

describe("appinsights tests", () => {

    it("telemetryclientwithcontext trackeventwithtemplate succefully", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{"testkey":"test-value"},"tagOverrides": {"samplingEnabled": "true"}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.awareOf("test", "test-value");
        client.trackEventWithProperties({testkey: "${test}"});
    });
    it("telemetryclientwithcontext trackeventwithtemplate empty", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{},"tagOverrides": {"samplingEnabled": "true"}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.trackEventWithProperties({});
    });

    it("telemetryclientwithcontext trackeventwithtemplate missing metadata key", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{"testkey":"undefined"},"tagOverrides": {"samplingEnabled": "true"}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.trackEventWithProperties({testkey: "${test1}"});
    });
});