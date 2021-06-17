/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as express from "express";
import * as o from "fp-ts/lib/Option";
import * as te from "fp-ts/lib/TaskEither";

import {
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseErrorGeneric,
  ResponseErrorFromValidationErrors,
  ResponseErrorForbiddenNotAuthorizedForRecipient,
  IResponseErrorForbiddenNotAuthorizedForRecipient,
  ResponseErrorInternal,
  ResponseErrorValidation
} from "@pagopa/ts-commons/lib/responses";

import { NewMessage } from "@pagopa/io-functions-commons/dist/generated/definitions/NewMessage";
import { toError } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { Context } from "@azure/functions";
import { IServiceClient } from "../utils/serviceClient";
import { TelemetryClientWithContextFactory } from "../utils/appinsights";
import { TelemetryClientWithContext } from "../utils/telemetryClientWithContext";
import { toSHA256 } from "../utils/conversions";

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

const getTrackingIdTemplate = (): string => "${fiscal_code}|${auth_code}";

const log = (
  telemetryClient: TelemetryClientWithContext
): readonly [
  (l: ProxyFailures) => ProxyFailures,
  (r: Response) => Response
] => [
  l => {
    telemetryClient.trackEventWithProperties(
      {
        errorDetail: l.detail || "",
        isSuccess: "false",
        trackingId: getTrackingIdTemplate()
      },
      "false"
    );
    return l;
  },
  r => {
    telemetryClient.trackEventWithProperties(
      {
        isSuccess: "true",
        trackingId: getTrackingIdTemplate()
      },
      "false"
    );
    return r;
  }
];

/**
 * Proxy logic over the downstream service
 *
 * @param client a http client for communicating with the downstream, proxied service
 * @param request the request coming to the proxy
 * @returns either a proxy failure or the http response coming from the proxied service
 */
export const submitMessageForUser = (
  client: IServiceClient,
  telemetryClient: TelemetryClientWithContext,
  request: express.Request
): te.TaskEither<ProxyFailures, Response> =>
  te.taskEither
    .of<ProxyFailures, unknown>(request.body)
    .chain(body =>
      te.fromEither(
        NewMessage.decode(body).bimap(
          ResponseErrorFromValidationErrors(NewMessage),
          fc => {
            telemetryClient.awareOfs({
              auth_code: toSHA256(fc.content.eu_covid_cert?.auth_code || ""),
              fiscal_code: toSHA256(fc.fiscal_code || "")
            });
            return fc.fiscal_code;
          }
        )
      )
    )
    .chain(fc =>
      te.fromOption<ProxyFailures>(() =>
        ResponseErrorValidation(
          "Missing Fiscal Code",
          "fiscal_code is required"
        )
      )(o.fromNullable(fc))
    )
    .chain(fiscal_code =>
      client
        .getLimitedProfileByPost(
          request.headers,
          fiscal_code,
          request.app.get("context") as Context
        )
        .map(e => ({ ...e, fiscal_code }))
    )
    .filterOrElse(
      profile => profile.sender_allowed,
      ResponseErrorForbiddenNotAuthorizedForRecipient
    )
    .chain(_ =>
      client.submitMessageForUser(
        _.fiscal_code,
        request.headers,
        request.body,
        request.app.get("context") as Context
      )
    )
    .bimap(...log(telemetryClient));

export const getSubmitMessageForUserHandler = (
  client: IServiceClient,
  telemetryFactory: TelemetryClientWithContextFactory
): express.RequestHandler => async (request, response): Promise<void> =>
  // call proxy logic
  submitMessageForUser(
    client,
    telemetryFactory.getClientFor("api.eucovidcers.submitmessageforuser"),
    request
  )
    // map a response coming from the downstream service onto the current response
    .chain(applyToExpressResponse(response))
    // map an error occurred into this proxy onto the current response
    .mapLeft(_ => _.apply(response))
    .fold(identity, identity)
    .run();
