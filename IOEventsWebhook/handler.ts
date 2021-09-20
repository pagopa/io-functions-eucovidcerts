import * as t from "io-ts";
import * as express from "express";
import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import { RequiredParamMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_param";
import {
  IResponseSuccessAccepted,
  ResponseSuccessAccepted
} from "@pagopa/ts-commons/lib/responses";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Context } from "@azure/functions";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";

type ExpectedEvents = t.TypeOf<typeof ExpectedEvents>;
const ExpectedEvents = t.literal("service-subscribed");

type ExpectedEventsWithPayload = t.TypeOf<typeof ExpectedEventsWithPayload>;
const ExpectedEventsWithPayload = t.interface({
  name: ExpectedEvents,
  payload: t.interface({
    hashedFiscalCode: NonEmptyString
  })
});

export const IOEventsWebhookHandler = () => (
  context: Context,
  eventName: NonEmptyString,
  eventPayload: unknown
): Promise<IResponseSuccessAccepted<unknown> /* | IResponseErrorInternal */> =>
  pipe(
    eventName,
    E.of,
    ExpectedEvents.decode,
    E.mapLeft(_ => {
      context.log.warn(
        `Discarded incoming event from IO: ${eventName}`,
        "Unexpeced event"
      );
      return ResponseSuccessAccepted();
    }),
    E.chainW(_ =>
      ExpectedEventsWithPayload.decode({
        name: eventName,
        payload: eventPayload
      })
    ),
    E.mapLeft(_ => {
      context.log.warn(
        `Discarded incoming event from IO: ${eventName}`,
        "Wrong payload"
      );
      return ResponseSuccessAccepted();
    }),
    TE.fromEither,
    TE.map(({ payload: { hashedFiscalCode } }) => {
      // eslint-disable-next-line functional/immutable-data
      context.bindings.outputFiscalCode = hashedFiscalCode;
      return ResponseSuccessAccepted();
    }),
    TE.toUnion
  )();

export const IOEventsWebhook = (): express.RequestHandler => {
  const handler = IOEventsWebhookHandler();

  const middlewaresWrap = withRequestMiddlewares(
    ContextMiddleware(),
    RequiredParamMiddleware("eventName", NonEmptyString),
    RequiredBodyPayloadMiddleware(t.unknown)
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
