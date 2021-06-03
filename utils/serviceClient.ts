import * as te from "fp-ts/lib/TaskEither";

import {
  IResponseErrorInternal,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";

import { LimitedProfile } from "@pagopa/io-functions-commons/dist/generated/definitions/LimitedProfile";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

import { toError } from "fp-ts/lib/Either";

export interface IServiceClient {
  readonly getLimitedProfileByPost: (
    reqHeaders: NodeJS.Dict<string | ReadonlyArray<string>>,
    fiscalCode: FiscalCode
  ) => te.TaskEither<IResponseErrorInternal, LimitedProfile>;
  readonly submitMessageForUser: (
    reqHeaders: NodeJS.Dict<string | ReadonlyArray<string>>,
    reqPayload: Response
  ) => te.TaskEither<IResponseErrorInternal, Response>;
}

export const createClient = (
  fetchApi: typeof fetch,
  apiUrl: string,
  apiKey: string
): IServiceClient => ({
  getLimitedProfileByPost: (
    reqHeaders,
    fiscalCode
  ): ReturnType<IServiceClient["getLimitedProfileByPost"]> =>
    te
      .tryCatch(
        () =>
          fetchApi(`${apiUrl}/profiles`, {
            body: JSON.stringify({ fiscal_code: fiscalCode }),
            headers: {
              ...reqHeaders,
              ["X-Functions-Key"]: apiKey
            },
            method: "POST"
          }),
        error => ResponseErrorInternal(String(error))
      )
      .chain(responseRaw =>
        te.tryCatch(
          () => responseRaw.json(),
          error => ResponseErrorInternal(String(error))
        )
        .filterOrElseL(
            _ => responseRaw.ok,
            _ => ResponseErrorInternal(`Error calling client api: ${_.status} - ${_.title}, ${_.detail}`)
          )
      )
      .chain(response =>
        te.fromEither(
          LimitedProfile.decode(response).mapLeft(validationErrors =>
            ResponseErrorInternal(validationErrors.toString())
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
            ...reqHeaders,
            ["X-Functions-Key"]: apiKey
          },

          method: "POST"
        }),
      e => ResponseErrorInternal(toError(e).message)
    )
});
