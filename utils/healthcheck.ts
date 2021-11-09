import { toError } from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as RA from "fp-ts/lib/ReadonlyArray";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

import { readableReport } from "@pagopa/ts-commons/lib/reporters";

import {
  common as azurestorageCommon,
  createBlobService,
  createFileService,
  createQueueService,
  createTableService
} from "azure-storage";

import { getConfig, IConfig } from "./config";

type ProblemSource = "Config" | "Url" | "AzureStorage";
// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/naming-convention
export type HealthProblem<S extends ProblemSource> = string & { __source: S };
export type HealthCheck<
  S extends ProblemSource = ProblemSource,
  T = true
> = TE.TaskEither<ReadonlyArray<HealthProblem<S>>, T>;

// format and cast a problem message with its source
const formatProblem = <S extends ProblemSource>(
  source: S,
  message: string
): HealthProblem<S> => `${source}|${message}` as HealthProblem<S>;

// utility to format an unknown error to an arry of HealthProblem
const toHealthProblems = <S extends ProblemSource>(source: S) => (
  e: unknown
): ReadonlyArray<HealthProblem<S>> => [
  formatProblem(source, toError(e).message)
];

/**
 * Check application's configuration is correct
 *
 * @returns either true or an array of error messages
 */
export const checkConfigHealth = (): HealthCheck<"Config", IConfig> =>
  pipe(
    getConfig(),
    TE.fromEither,
    TE.mapLeft(errors =>
      errors.map(e =>
        // give each problem its own line
        formatProblem("Config", readableReport([e]))
      )
    )
  );

/**
 * Check the application can connect to an Azure Storage
 *
 * @param connStr connection string for the storage
 *
 * @returns either true or an array of error messages
 */
export const checkAzureStorageHealth = (
  connStr: string
): HealthCheck<"AzureStorage"> => {
  const applicativeValidation = TE.getApplicativeTaskValidation(
    T.ApplicativePar,
    RA.getSemigroup<HealthProblem<"AzureStorage">>()
  );
  return pipe(
    // try to instantiate a client for each product of azure storage
    [
      createBlobService,
      createFileService,
      createQueueService,
      createTableService
    ]
      // for each, create a task that wraps getServiceProperties
      .map(createService =>
        TE.tryCatch(
          () =>
            new Promise<
              azurestorageCommon.models.ServicePropertiesResult.ServiceProperties
            >((resolve, reject) =>
              createService(connStr).getServiceProperties((err, result) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                err
                  ? reject(err.message.replace(/\n/gim, " ")) // avoid newlines
                  : resolve(result);
              })
            ),
          toHealthProblems("AzureStorage")
        )
      ),
    // run each taskEither and gather validation errors from each one of them, if any
    A.sequence(applicativeValidation),
    TE.map(_ => true)
  );
};

/**
 * Execute all the health checks for the application
 *
 * @returns either true or an array of error messages
 */
export const checkApplicationHealth = (): HealthCheck<ProblemSource, true> => {
  const applicativeValidation = TE.getApplicativeTaskValidation(
    T.ApplicativePar,
    RA.getSemigroup<HealthProblem<ProblemSource>>()
  );
  return pipe(
    void 0,
    TE.of,
    TE.chain(_ => checkConfigHealth()),
    TE.chain(config =>
      // run each taskEither and gather validation errors from each one of them, if any
      sequenceT(applicativeValidation)(
        checkAzureStorageHealth(config.QueueStorageConnection)
      )
    ),
    TE.map(_ => true)
  );
};
