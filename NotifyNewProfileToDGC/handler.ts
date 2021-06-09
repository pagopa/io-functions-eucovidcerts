import { Context } from "@azure/functions";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { fromEither, left2v, taskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { errorsToError } from "../utils/conversions";
import { createDGCClientSelector } from "../utils/dgcClientSelector";

const logPrefix = "NotifyNewProfile";

export const NotifyNewProfile = (
  dgcClientSelector: ReturnType<typeof createDGCClientSelector>
) => async (context: Context, input: unknown): Promise<string> =>
  fromEither(NonEmptyString.decode(input).mapLeft(errorsToError))
    .chain(cfSHA256 =>
      tryCatch(
        () =>
          dgcClientSelector.select(cfSHA256).managePreviousCertificates({
            body: { cfSHA256 }
          }),
        _ => new Error("Error calling managePreviousCertificates API")
      )
    )
    .chain(_ => fromEither(_).mapLeft(errorsToError))
    .chain(_ => {
      if (_.status === 200) {
        return taskEither.of("OK");
      }
      return left2v(
        new Error(
          `managePreviousCertificates status response [${_.status}] unexpected`
        )
      );
    })
    .getOrElseL(err => {
      context.log.error(`${logPrefix}|ERROR|${err}`);
      throw err;
    })
    .run();
