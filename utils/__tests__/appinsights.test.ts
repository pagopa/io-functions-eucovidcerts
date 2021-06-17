import { Contracts, TelemetryClient } from 'applicationinsights';
import { TelemetryClientWithContext } from '../appinsights';

const dummyTrackEvent: (expectedEvent: Contracts.EventTelemetry) => ((telemetry: Contracts.EventTelemetry) => void) = (expectedEvent) => 
    (telemetry: Contracts.EventTelemetry) => expect(telemetry).toEqual(expectedEvent)

describe("appinsights tests", () => {

    it("telemetryclientwithcontext trackeventwithtemplate succefully", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{"testkey":"test-value"}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.awareOf("test", "test-value");
        client.trackEventWithTemplate({testkey: "${test}"});
    });

    it("telemetryclientwithcontext trackeventwithtemplate empty", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.trackEventWithTemplate({});
    });

    it("telemetryclientwithcontext trackeventwithtemplate missing metadata key", () => {
        const client = new TelemetryClientWithContext({
            trackEvent: dummyTrackEvent({"name":"appinsights test name","properties":{"testkey":"undefined"}})
        } as unknown as TelemetryClient, "appinsights test name");
        client.trackEventWithTemplate({testkey: "${test1}"});
    });
});