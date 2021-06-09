import { toError } from "fp-ts/lib/Either";
import {
  fromEither,
  taskEither,
  TaskEither,
  tryCatch
} from "fp-ts/lib/TaskEither";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { getFetch } from "@pagopa/ts-commons/lib/agent";

import { sequenceT } from "fp-ts/lib/Apply";
import { array } from "fp-ts/lib/Array";

import {
  common as azurestorageCommon,
  createBlobService,
  createFileService,
  createQueueService,
  createTableService
} from "azure-storage";
import { getConfig, IConfig } from "./config";

const fetch = getFetch(process.env);

type ProblemSource = "Config" | "Url" | "AzureStorage";
// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/naming-convention
export type HealthProblem<S extends ProblemSource> = string & { __source: S };
export type HealthCheck<
  S extends ProblemSource = ProblemSource,
  T = true
> = TaskEither<ReadonlyArray<HealthProblem<S>>, T>;

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
  fromEither(getConfig()).mapLeft(errors =>
    errors.map(e =>
      // give each problem its own line
      formatProblem("Config", readableReport([e]))
    )
  );

/**
 * Check a url is reachable
 *
 * @param url url to connect with
 *
 * @returns either true or an array of error messages
 */
export const checkUrlHealth = (url: string): HealthCheck<"Url", true> =>
  tryCatch(() => fetch(url, { method: "HEAD" }), toHealthProblems("Url")).map(
    _ => true
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
): HealthCheck<"AzureStorage"> =>
  array
    .sequence(taskEither)(
      // try to instantiate a client for each product of azure storage
      [
        createBlobService,
        createFileService,
        createQueueService,
        createTableService
      ]
        // for each, create a task that wraps getServiceProperties
        .map(createService =>
          tryCatch(
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
        )
    )
    .map(_ => true);

/**
 * Execute all the health checks for the application
 *
 * @returns either true or an array of error messages
 */
export const checkApplicationHealth = (): HealthCheck<ProblemSource, true> =>
  taskEither
    .of<ReadonlyArray<HealthProblem<ProblemSource>>, void>(void 0)
    .chain(_ => checkConfigHealth())
    .chain(config =>
      // TODO: once we upgrade to fp-ts >= 1.19 we can use Validation to collect all errors, not just the first to happen
      sequenceT(taskEither)<
        ReadonlyArray<HealthProblem<ProblemSource>>,
        // eslint-disable-next-line functional/prefer-readonly-type
        Array<TaskEither<ReadonlyArray<HealthProblem<ProblemSource>>, true>>
      >(
        checkAzureStorageHealth(config.QueueStorageConnection),
        checkAzureStorageHealth(config.EventsQueueStorageConnection)
      )
    )
    .map(_ => true);
