import * as te from "fp-ts/lib/TaskEither";

import {
  IResponseErrorInternal,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";

import { LimitedProfile } from "@pagopa/io-functions-commons/dist/generated/definitions/LimitedProfile";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

import { toError } from "fp-ts/lib/Either";
import { Context } from "@azure/functions";

/**
 * Filter
 *
 * @param param0
 * @returns
 */
const proxyHeaders = ({
  ["X-Functions-Key"]: xFunctionsKey,
  ["x-user-groups"]: xUserGroup,
  ["x-subscription-id"]: xSubId,
  ["x-user-email"]: xUserEmail,
  ["x-user-id"]: xUserId,
  ["x-client-ip"]: xClientIp,
  ["x-forwarded-for"]: xFF
}: NodeJS.Dict<string | ReadonlyArray<string>>): NodeJS.Dict<
  string | ReadonlyArray<string>
> => ({
  ["X-Functions-Key"]: xFunctionsKey,
  ["x-client-ip"]: xClientIp,
  ["x-forwarded-for"]: xFF,
  ["x-subscription-id"]: xSubId,
  ["x-user-email"]: xUserEmail,
  ["x-user-groups"]: xUserGroup,
  ["x-user-id"]: xUserId
});

export interface IServiceClient {
  readonly getLimitedProfileByPost: (
    reqHeaders: NodeJS.Dict<string | ReadonlyArray<string>>,
    fiscalCode: FiscalCode,
    context: Context
  ) => te.TaskEither<IResponseErrorInternal, LimitedProfile>;
  readonly submitMessageForUser: (
    reqHeaders: NodeJS.Dict<string | ReadonlyArray<string>>,
    reqPayload: Response,
    context: Context
  ) => te.TaskEither<IResponseErrorInternal, Response>;
}

export const createClient = (
  fetchApi: typeof fetch,
  apiUrl: string,
  apiKey: string
): IServiceClient => ({
  getLimitedProfileByPost: (
    reqHeaders,
    fiscalCode,
    _context
  ): ReturnType<IServiceClient["getLimitedProfileByPost"]> =>
    te
      .tryCatch(
        () =>
          fetchApi(`${apiUrl}/profiles`, {
            body: JSON.stringify({ fiscal_code: fiscalCode }),
            headers: {
              ...proxyHeaders(reqHeaders),
              ["X-Functions-Key"]: apiKey
            },
            method: "POST"
          }),
        error => ResponseErrorInternal(String(error))
      )
      .chain(responseRaw =>
        te
          .tryCatch(
            () => responseRaw.json(),
            error => ResponseErrorInternal(String(error))
          )
          .filterOrElseL(
            _ => responseRaw.ok,
            _ => ResponseErrorInternal(`Error calling client api: ${String(_)}`)
          )
      )
      .chain(response =>
        te.fromEither(
          LimitedProfile.decode(response).mapLeft(_ =>
            ResponseErrorInternal(`Failed to decode profile`)
          )
        )
      ),
  submitMessageForUser: (
    reqHeaders,
    reqPayload
  ): ReturnType<IServiceClient["submitMessageForUser"]> =>
    te.tryCatch(
      () =>
        fetchApi(`${apiUrl}/messages`, {
          body: JSON.stringify(reqPayload), // HAZARD
          headers: {
            ...proxyHeaders(reqHeaders),
            ["X-Functions-Key"]: apiKey
          },

          method: "POST"
        }),
      e => ResponseErrorInternal(toError(e).message)
    )
});
