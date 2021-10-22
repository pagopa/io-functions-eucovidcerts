import { Context } from "@azure/functions";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { None } from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";

import { HealthCheck, HealthProblem } from "../../utils/healthcheck";
import { IOEventsWebhookHandler } from "../handler";

afterEach(() => {
  jest.clearAllMocks();
});

describe("IOEventsWebhookHandler", () => {
  it("should consume an expected event", async () => {
    const mockContext = ({ log: console, bindings: {} } as unknown) as Context;
    const name = "service-subscribed" as NonEmptyString;
    const payload = { hashedFiscalCode: "fakevalue" };
    const handler = IOEventsWebhookHandler();

    const response = await handler(mockContext, { name, payload });

    expect(response.kind).toBe("IResponseSuccessAccepted");
    expect(mockContext.bindings.outputFiscalCode).toBe(
      payload.hashedFiscalCode
    );
  });

  it("should not consume an unexpected event", async () => {
    const mockContext = ({ log: console, bindings: {} } as unknown) as Context;
    const name = "unexpected-event" as NonEmptyString;
    const payload = { hashedFiscalCode: "fakevalue" };
    const handler = IOEventsWebhookHandler();

    const response = await handler(mockContext, { name, payload });

    expect(response.kind).toBe("IResponseSuccessAccepted");
    expect(mockContext.bindings.outputFiscalCode).toBe(undefined);
  });

  it("should not consume an event with wrong payload", async () => {
    const mockContext = ({
      log: console,
      bindings: {}
    } as unknown) as Context;
    const name = "service-subscribed" as NonEmptyString;
    const payload = { wrongField: "fakevalue" };
    const handler = IOEventsWebhookHandler();

    const response = await handler(mockContext, { name, payload });

    expect(response.kind).toBe("IResponseSuccessAccepted");
    expect(mockContext.bindings.outputFiscalCode).toBe(undefined);
  });
});
