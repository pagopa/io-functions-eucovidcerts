import * as te from "fp-ts/lib/TaskEither";

import {
  IResponseErrorInternal,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";

import { LimitedProfile } from "@pagopa/io-functions-commons/dist/generated/definitions/LimitedProfile";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

import { toError } from "fp-ts/lib/Either";
import { Context } from "@azure/functions";

import nodeFetch from "node-fetch";

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
    context
  ): ReturnType<IServiceClient["getLimitedProfileByPost"]> =>
    te
      .tryCatch(
        () => {
          context.log.info(
            "sto per chiamare questa roba qui:",
            `${apiUrl}/profiles`,
            {
              body: JSON.stringify({ fiscal_code: fiscalCode }),
              headers: {
                ...reqHeaders,
                ["X-Functions-Key"]: apiKey
              },
              method: "POST"
            }
          );
          return nodeFetch(
            `https://run.mocky.io/v3/6bdb278f-e998-4a48-84d4-bc280d298769`,
            {
              body: JSON.stringify({ fiscal_code: fiscalCode }),
              headers: {
                ...reqHeaders,
                ["X-Functions-Key"]: apiKey
              },
              method: "POST"
            }
          );
        },
        error => ResponseErrorInternal(String(error))
      )
      .chain(responseRaw =>
        te
          .tryCatch(
            async () => {
              try {
                context.log.info("e fino a qua...", responseRaw.status);
                const s = await responseRaw.json();
                context.log.info("...tutto bene", s);
                return s;
              } catch (error) {
                context.log.error("qua se spacca tutto fra", error);
              }
            },
            error => ResponseErrorInternal(String(error))
          )
          .filterOrElseL(
            _ => responseRaw.ok,
            _ =>
              ResponseErrorInternal(
                `Error calling client api: ${_.status} - ${_.title}, ${_.detail}`
              )
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
    reqPayload,
    context
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
