import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";

import {
  IResponseErrorInternal,
  IResponseErrorForbiddenNotAuthorizedForRecipient,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";

import { LimitedProfile } from "@pagopa/io-functions-commons/dist/generated/definitions/LimitedProfile";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

import { toError } from "fp-ts/lib/Either";
import { Context } from "@azure/functions";
import { ValidUrl } from "@pagopa/ts-commons/lib/url";
import { toSHA256 } from "./conversions";

/**
 * Filter incoming header to only consider headers we need
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
  ) => TE.TaskEither<
    IResponseErrorInternal | IResponseErrorForbiddenNotAuthorizedForRecipient,
    LimitedProfile
  >;
  readonly submitMessageForUser: (
    fiscalCode: FiscalCode,
    reqHeaders: NodeJS.Dict<string | ReadonlyArray<string>>,
    reqPayload: Response,
    context: Context
  ) => TE.TaskEither<IResponseErrorInternal, Response>;
}

/**
 * Given a pool of URLs, build a selector that retrieves one url after a provided fiscal code
 * The purpose is to evenly distribute requests over the pool of different URLs
 *
 * @param pool the pool of urls
 * @returns the selector function
 */
export const createPoolSelector = (
  pool: ReadonlyArray<ValidUrl>
): ((fiscalCode: FiscalCode) => ValidUrl) => {
  const alphabet = Array.from({ length: 16 }).map((_, i) => i.toString(16));
  // eslint-disable-next-line sonarjs/no-unused-collection
  const chunks = Array<ReadonlyArray<string>>();
  const chunkSize = Math.ceil(alphabet.length / pool.length);

  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < pool.length; i++) {
    // eslint-disable-next-line functional/immutable-data
    chunks.push(alphabet.slice(i * chunkSize, i * chunkSize + chunkSize));
  }
  return (fiscalCode): ValidUrl => {
    const [firstChar] = toSHA256(fiscalCode);
    const i = chunks.findIndex(e => e.includes(firstChar));
    return pool[i] || pool[0];
  };
};

/**
 * This client is a proxy on fns-services
 *
 * @param fetchApi
 * @param apiUrls a pool of base url for different instances of fn3-services
 * @param apiKey apykey to autenticate requests towards fn3-services. Must be the same for all instances
 * @returns
 */
export const createClient = (
  fetchApi: typeof fetch,
  apiUrls: ReadonlyArray<ValidUrl>,
  apiKey: string
): IServiceClient => {
  const selectApiUrl = createPoolSelector(apiUrls);
  return {
    getLimitedProfileByPost: (
      reqHeaders,
      fiscalCode,
      _context
    ): ReturnType<IServiceClient["getLimitedProfileByPost"]> =>
      pipe(
        TE.tryCatch(
          () =>
            fetchApi(`${selectApiUrl(fiscalCode).href}/profiles`, {
              body: JSON.stringify({ fiscal_code: fiscalCode }),
              headers: {
                ...proxyHeaders(reqHeaders),
                ["X-Functions-Key"]: apiKey
              },
              method: "POST"
            }),
          error => ResponseErrorInternal(String(error))
        ),
        x => x,
        TE.chain(responseRaw =>
          pipe(
            TE.tryCatch<
              | IResponseErrorInternal
              | IResponseErrorForbiddenNotAuthorizedForRecipient,
              unknown
            >(
              () => responseRaw.json(),
              error => ResponseErrorInternal(String(error))
            ),

            // If the profile was not found or service is not authorized returns status code 403
            TE.filterOrElseW(
              _ => responseRaw.status !== 404 && responseRaw.status !== 403,
              _ =>
                ResponseErrorInternal(
                  JSON.stringify({
                    body: JSON.stringify({ fiscal_code: fiscalCode }),
                    headers: {
                      ...proxyHeaders(reqHeaders),
                      ["X-Functions-Key"]: apiKey
                    },
                    method: "POST",
                    url: `${selectApiUrl(fiscalCode).href}/profiles`
                  })
                )
            ),
            // If the response is not 200 returns status code 500
            TE.filterOrElseW(
              _ => responseRaw.ok,
              _ =>
                ResponseErrorInternal(
                  `Error calling client api: ${JSON.stringify(_)}`
                )
            )
          )
        ),
        TE.chainW(
          flow(
            LimitedProfile.decode,
            E.mapLeft(_ => ResponseErrorInternal(`Failed to decode profile`)),
            TE.fromEither
          )
        )
      ),

    submitMessageForUser: (
      fiscalCode,
      reqHeaders,
      reqPayload
    ): ReturnType<IServiceClient["submitMessageForUser"]> =>
      pipe(
        TE.tryCatch(
          () =>
            fetchApi(`${selectApiUrl(fiscalCode).href}/messages`, {
              body: JSON.stringify(reqPayload),
              headers: {
                ...proxyHeaders(reqHeaders),
                ["X-Functions-Key"]: apiKey
              },

              method: "POST"
            }),
          e => ResponseErrorInternal(toError(e).message)
        )
      )
  };
};
