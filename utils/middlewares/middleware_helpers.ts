import * as express from "express";
import {
  IRequestMiddleware,
  RequestHandler
} from "@pagopa/ts-commons/lib/request_middleware";
import {
  IResponse,
  IResponseErrorInternal,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";
import { sequenceS } from "fp-ts/lib/Apply";
import { isRight, toError } from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { identity } from "fp-ts/lib/function";
import { IRequestMiddlewares } from "./middleware_types";

type GetMiddlewaresTaskEithersReturn<K, R, T> = EnforceNonEmptyRecord<
  {
    readonly [key in keyof K]: TE.TaskEither<IResponse<R>, T>;
  }
>;
const getMiddlewaresTaskEithers = <K, R, T>(
  middlewares: IRequestMiddlewares<K, R, T>
) => (req: express.Request): GetMiddlewaresTaskEithersReturn<K, R, T> =>
  Object.entries(middlewares).reduce(
    (prev, [name, middleware]) => ({
      ...prev,
      [name]: TE.tryCatch(
        async () => await (middleware as IRequestMiddleware<R, T>)(req),
        _ => ResponseErrorInternal(`error executing middleware ${name}`)
      )
        .mapLeft<IResponse<R> | IResponseErrorInternal>(identity)
        .chain(rr => (isRight(rr) ? TE.right2v(rr.value) : TE.left2v(rr.value)))
    }),
    {}
  ) as GetMiddlewaresTaskEithersReturn<K, R, T>;

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R;

type IRequestHandler<Params, Return> = (
  argsss: Params
) => Promise<IResponse<Return>>;

export const withRequestMiddlewares = <
  R,
  T,
  K extends string | number | symbol,
  Params extends Record<K, T> = Record<K, T>
>(
  middlewares: IRequestMiddlewares<Params, R, T>
) => <RH>(
  handler: IRequestHandler<Params, RH>
): RequestHandler<RH | R | "IResponseErrorInternal"> => async (
  request: express.Request
): Promise<IResponse<RH | R | "IResponseErrorInternal">> =>
  Object.keys(middlewares).length > 0
    ? sequenceS(TE.taskEither)(getMiddlewaresTaskEithers(middlewares)(request))
        .mapLeft(x => x as IResponse<R> | IResponseErrorInternal)
        .chain(params2 =>
          TE.tryCatch(() => handler(params2 as Params), toError).mapLeft(err =>
            ResponseErrorInternal(
              `Error executing endpoint handler:` + err.message
            )
          )
        )
        .fold<IResponse<RH | R | "IResponseErrorInternal">>(identity, identity)
        .run()
    : handler({} as Params);
