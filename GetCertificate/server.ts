/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { Context } from "@azure/functions";
import { wrapRequestHandler } from "@pagopa/ts-commons/lib/request_middleware";

import * as express from "express";
import {
  IResponseErrorForbiddenNotAuthorized,
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { Certificate } from "../generated/definitions/Certificate";
import { GetCertificateParams } from "../generated/definitions/GetCertificateParams";

import { withRequestMiddlewares } from "../utils/middlewares/middleware_helpers";
import { IRequestMiddlewares } from "../utils/middlewares/middleware_types";

type Failures =
  | IResponseErrorInternal
  | IResponseErrorValidation
  | IResponseErrorForbiddenNotAuthorized;

// todo: generate it
export type IGeneratedRequestHandlerParams = Readonly<{
  params: GetCertificateParams;
}>;

export type IRequestHandlerParams<
  OtherParams extends Record<string, K>,
  K
> = IGeneratedRequestHandlerParams & OtherParams;

export type IRequestHandlerr<OtherParams extends Record<string, K>, K> = (
  argss: IRequestHandlerParams<OtherParams, K>
) => Promise<IResponseSuccessJson<Certificate> | Failures>;

// handler: (req: express.Request) => Promise<IResponse<T>>

const generatedMiddlewares: IRequestMiddlewares<
  IGeneratedRequestHandlerParams,
  "IResponseErrorValidation",
  GetCertificateParams
> = {
  params: RequiredBodyPayloadMiddleware(GetCertificateParams)
};

// todo: setup<Name>
export const setupGetCertificate = <
  // eslint-disable-next-line @typescript-eslint/ban-types
  OtherParams extends Record<string, K> | never,
  H extends string = string,
  K extends Context = Context
>(
  app: express.Express,
  // todo: IRequestHandler<Name>
  // TODO: WIP, use OtherParams instead
  handler: IRequestHandlerr<OtherParams, K>,
  middlewares?: IRequestMiddlewares<OtherParams, H, K>
): void => {
  // eslint-disable-next-line functional/no-let
  let wrappedWithMiddlewares;
  if (middlewares) {
    const allMiddlewares = {
      ...middlewares,
      ...generatedMiddlewares
    };

    wrappedWithMiddlewares = withRequestMiddlewares<
      "IResponseErrorValidation" | H,
      GetCertificateParams | K,
      keyof IRequestHandlerParams<OtherParams, K>,
      IGeneratedRequestHandlerParams & OtherParams
    >(allMiddlewares)(handler);
  } else {
    wrappedWithMiddlewares = withRequestMiddlewares<
      "IResponseErrorValidation",
      GetCertificateParams,
      keyof IGeneratedRequestHandlerParams,
      IGeneratedRequestHandlerParams
    >(generatedMiddlewares)(
      handler as (
        argss: IGeneratedRequestHandlerParams
      ) => Promise<IResponseSuccessJson<Certificate> | Failures>
    );
  }

  const handlerWithMiddlewares = wrapRequestHandler(wrappedWithMiddlewares);

  // todo: IF get/post
  // todo: set endopoint
  app.post("/api/v1/certificate", handlerWithMiddlewares);
};
