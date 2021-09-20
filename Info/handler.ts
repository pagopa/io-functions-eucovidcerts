import * as express from "express";
import { wrapRequestHandler } from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorInternal,
  IResponseSuccessJson,
  ResponseErrorInternal,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";

import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import * as packageJson from "../package.json";
import { checkApplicationHealth, HealthCheck } from "../utils/healthcheck";

interface IInfo {
  readonly name: string;
  readonly version: string;
}

type InfoHandler = () => Promise<
  IResponseSuccessJson<IInfo> | IResponseErrorInternal
>;

export const InfoHandler = (
  healthCheck: HealthCheck
): InfoHandler => (): Promise<
  IResponseSuccessJson<IInfo> | IResponseErrorInternal
> =>
  pipe(
    healthCheck,
    TE.bimap(
      (problems: ReadonlyArray<string>) =>
        ResponseErrorInternal(problems.join("\n\n")),
      _ =>
        ResponseSuccessJson({
          name: packageJson.name,
          version: packageJson.version
        })
    ),
    TE.toUnion
  )();

export const Info = (): express.RequestHandler => {
  const handler = InfoHandler(checkApplicationHealth());

  return wrapRequestHandler(handler);
};
