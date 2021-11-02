import * as t from "io-ts";
import * as express from "express";
import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseSuccessAccepted,
  ResponseSuccessAccepted
} from "@pagopa/ts-commons/lib/responses";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { Context } from "@azure/functions";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { toSHA256 } from "../utils/conversions";

type ExpectedEvents = t.TypeOf<typeof ExpectedEvents>;
const ExpectedEvents = t.literal("service:subscribed");

type ExpectedEventsWithPayload = t.TypeOf<typeof ExpectedEventsWithPayload>;
const ExpectedEventsWithPayload = t.interface({
  name: ExpectedEvents,
  payload: t.interface({
    fiscalCode: FiscalCode
  })
});

export const IOEventsWebhookHandler = () => (
  context: Context,
  input: unknown
): Promise<IResponseSuccessAccepted<unknown> /* | IResponseErrorInternal */> =>
  pipe(
    input,
    // check the incoming event is expected, otherwise just skip it
    flow(
      ExpectedEventsWithPayload.decode,
      E.mapLeft(err => {
        context.log.warn(
          `Discarded incoming event from IO: ${readableReport(err)}`,
          "Unexpected event"
        );
        return ResponseSuccessAccepted();
      })
    ),

    // if fine, just propagate the event
    E.map(({ payload: { fiscalCode } }) => {
      // eslint-disable-next-line functional/immutable-data
      context.bindings.outputFiscalCode = toSHA256(fiscalCode);
      return ResponseSuccessAccepted();
    }),
    TE.fromEither,
    TE.toUnion
  )();

export const IOEventsWebhook = (): express.RequestHandler => {
  const handler = IOEventsWebhookHandler();

  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    RequiredBodyPayloadMiddleware(t.unknown)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
