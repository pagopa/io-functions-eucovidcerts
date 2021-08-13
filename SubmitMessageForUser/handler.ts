import { TelemetryClient } from "applicationinsights";
import * as express from "express";
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { Context } from "@azure/functions";

import {
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseErrorGeneric,
  ResponseErrorFromValidationErrors,
  ResponseErrorForbiddenNotAuthorizedForRecipient,
  IResponseErrorForbiddenNotAuthorizedForRecipient,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

import { IServiceClient } from "../utils/serviceClient";

// a codec that identifies a payload containing a fiscal code
type WithFiscalCode = t.TypeOf<typeof WithFiscalCode>;
const WithFiscalCode = t.interface({
  fiscal_code: FiscalCode
});

/**
 * Apply a fetch response on a given Express response
 *
 * @param expressResponse
 * @param fetchResponse
 * @returns either void or an internal error
 */
const applyToExpressResponse = (expressResponse: express.Response) => (
  fetchResponse: Response
): TE.TaskEither<IResponseErrorInternal, void> =>
  TE.tryCatch(
    async () => {
      for (const [key, value] of fetchResponse.headers.entries()) {
        expressResponse.set(key, value);
      }
      expressResponse
        .status(fetchResponse.status || 500)
        .json(await fetchResponse.json());
    },
    _ => ResponseErrorInternal(toError(_).message)
  );

// kind of failures specific of this proxy implementation
type ProxyFailures =
  | IResponseErrorInternal
  | IResponseErrorValidation
  | IResponseErrorGeneric
  | IResponseErrorForbiddenNotAuthorizedForRecipient;

/**
 * Proxy logic over the downstream service
 *
 * @param client a http client for communicating with the downstream, proxied service
 * @param request the request coming to the proxy
 * @returns either a proxy failure or the http response coming from the proxied service
 */
export const submitMessageForUser = (
  client: IServiceClient,
  telemetryClient: TelemetryClient,
  request: express.Request
): TE.TaskEither<ProxyFailures, Response> =>
  pipe(
    request.body,
    TE.of,
    TE.chain(
      flow(
        WithFiscalCode.decode,
        E.bimap(
          ResponseErrorFromValidationErrors(WithFiscalCode),
          fc => fc.fiscal_code
        ),
        TE.fromEither
      )
    ),
    TE.chainW(fiscal_code =>
      pipe(
        client.getLimitedProfileByPost(
          request.headers,
          fiscal_code,
          request.app.get("context") as Context
        ),
        TE.map(e => ({ ...e, fiscal_code }))
      )
    ),
    TE.filterOrElseW(
      profile => profile.sender_allowed,
      () => ResponseErrorForbiddenNotAuthorizedForRecipient
    ),
    TE.chainW(profile =>
      client.submitMessageForUser(
        profile.fiscal_code,
        request.headers,
        request.body,
        request.app.get("context") as Context
      )
    )
  );

export const getSubmitMessageForUserHandler = (
  client: IServiceClient,
  telemetryClient: TelemetryClient
): express.RequestHandler => async (request, response): Promise<void> =>
  // call proxy logic
  {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const p = pipe(
      submitMessageForUser(client, telemetryClient, request),
      // map a response coming from the downstream service onto the current response
      TE.chainW(applyToExpressResponse(response)),

      // map an error occurred into this proxy onto the current response
      TE.mapLeft(_ => _.apply(response)),
      TE.toUnion
    );

    return p();
  };
