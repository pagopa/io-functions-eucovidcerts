import { Context } from "@azure/functions";
import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { None } from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { toSHA256 } from "../../utils/conversions";

import { HealthCheck, HealthProblem } from "../../utils/healthcheck";
import { IOEventsWebhookHandler } from "../handler";

const aFiscalCode = "AAABBB00A00A000B" as FiscalCode;

afterEach(() => {
  jest.clearAllMocks();
});

describe("IOEventsWebhookHandler", () => {
  it("should consume an expected event", async () => {
    const mockContext = ({ log: console, bindings: {} } as unknown) as Context;
    const name = "service:subscribed" as NonEmptyString;
    const payload = { fiscalCode: aFiscalCode };
    const handler = IOEventsWebhookHandler();

    const response = await handler(mockContext, { name, payload });

    expect(response.kind).toBe("IResponseSuccessAccepted");
    expect(mockContext.bindings.outputFiscalCode).toBe(
      toSHA256(payload.fiscalCode)
    );
  });

  it("should not consume an unexpected event", async () => {
    const mockContext = ({ log: console, bindings: {} } as unknown) as Context;
    const name = "unexpected-event" as NonEmptyString;
    const payload = { fiscalCode: aFiscalCode };
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
    const name = "service:subscribed" as NonEmptyString;
    const payload = { wrongField: "fakevalue" };
    const handler = IOEventsWebhookHandler();

    const response = await handler(mockContext, { name, payload });

    expect(response.kind).toBe("IResponseSuccessAccepted");
    expect(mockContext.bindings.outputFiscalCode).toBe(undefined);
  });
});
