import * as express from "express";
import * as t from "io-ts";
import * as te from "fp-ts/lib/TaskEither";

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
import { toError } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { Context } from "@azure/functions";
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
): te.TaskEither<IResponseErrorInternal, void> =>
  te.tryCatch(
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
  request: express.Request
): te.TaskEither<ProxyFailures, Response> =>
  te.taskEither
    .of<ProxyFailures, unknown>(request.body)
    .chain(body =>
      te.fromEither(
        WithFiscalCode.decode(body).bimap(
          ResponseErrorFromValidationErrors(WithFiscalCode),
          fc => fc.fiscal_code
        )
      )
    )
    .chain(fiscal_code =>
      client.getLimitedProfileByPost(
        request.headers,
        fiscal_code,
        request.app.get("context") as Context
      )
    )
    .filterOrElse(
      profile => profile.sender_allowed,
      ResponseErrorForbiddenNotAuthorizedForRecipient
    )
    .chain(_ =>
      client.submitMessageForUser(
        request.headers,
        request.body,
        request.app.get("context") as Context
      )
    );

export const getSubmitMessageForUserHandler = (
  client: IServiceClient
): express.RequestHandler => async (request, response): Promise<void> =>
  // call proxy logic
  submitMessageForUser(client, request)
    // map a response coming from the downstream service onto the current response
    .chain(applyToExpressResponse(response))
    // map an error occurred into this proxy onto the current response
    .mapLeft(_ => _.apply(response))
    .fold(identity, identity)
    .run();
