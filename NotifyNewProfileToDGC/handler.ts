import { Context } from "@azure/functions";

import { toError } from "fp-ts/lib/Either";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";

import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";

import { createDGCClientSelector } from "../utils/dgcClientSelector";
import { errorsToError } from "../utils/conversions";

const logPrefix = "NotifyNewProfile";

export const NotifyNewProfile = (
  dgcClientSelector: ReturnType<typeof createDGCClientSelector>
) => async (context: Context, input: unknown): Promise<string> =>
  pipe(
    input,
    NonEmptyString.decode,
    E.mapLeft(errorsToError),
    TE.fromEither,
    TE.chain(cfSHA256 =>
      TE.tryCatch(
        () =>
          dgcClientSelector.select(cfSHA256).managePreviousCertificates({
            body: { cfSHA256 }
          }),
        _ =>
          new Error(
            `Error calling managePreviousCertificates API, error: ${
              toError(_).message
            }`
          )
      )
    ),
    TE.chain(flow(TE.fromEither, TE.mapLeft(errorsToError))),
    TE.chain(_ => {
      if (_.status === 200) {
        return TE.of("OK");
      }
      return TE.left(
        new Error(
          `managePreviousCertificates status response [${_.status}] unexpected`
        )
      );
    }),
    TE.getOrElse(err => {
      context.log.error(`${logPrefix}|ERROR|${err}`);
      throw err;
    })
  )();
