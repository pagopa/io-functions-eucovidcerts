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
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { Certificate } from "../generated/definitions/Certificate";
import { GetCertificateParams } from "../generated/definitions/GetCertificateParams";

import { withRequestMiddlewares } from "../utils/middlewares/middleware_helpers";
import {
  AllMiddlewaresFailureResults,
  AllMiddlewaresResults,
  IRequestMiddlewares,
  MiddlewaresResults
} from "../utils/middlewares/middleware_types";

type Failures =
  | IResponseErrorInternal
  | IResponseErrorValidation
  | IResponseErrorForbiddenNotAuthorized;

// todo: generate
export type IGeneratedRequestHandlerParams = Readonly<{
  params: GetCertificateParams;
}>;

export type IRequestHandlerParams<
  OtherParams extends { readonly [key: string]: any }
> = IGeneratedRequestHandlerParams & OtherParams;

export type IRequestHandler<OtherParams> = (
  args: IRequestHandlerParams<OtherParams>
) => Promise<IResponseSuccessJson<Certificate> | Failures>;

// todo: setup<Name>
export const setupGetCertificate = <
  OtherParams extends { readonly [key: string]: T },
  R = any,
  T = any
>(
  app: express.Express,
  // todo: IRequestHandler<Name>
  // TODO: WIP, use OtherParams instead
  handler: IRequestHandler<{ context: Context }>,
  middlewares?: IRequestMiddlewares<OtherParams, R, T>
): void => {
  const generatedMiddlewares = {
    params: RequiredBodyPayloadMiddleware(GetCertificateParams)
  };

  // TODO: WIP, extract it
  const otherMiddlewares = {
    context: ContextMiddleware()
  };

  const allMiddlewares = {
    ...otherMiddlewares,
    params: RequiredBodyPayloadMiddleware(GetCertificateParams)
  };

  const wrappedWithMiddlewares = withRequestMiddlewares<
    IRequestHandlerParams<{ context: Context }>,
    AllMiddlewaresFailureResults<typeof allMiddlewares>,
    AllMiddlewaresResults<typeof allMiddlewares>
  >(allMiddlewares)(handler);

  const handlerWithMiddlewares = wrapRequestHandler(wrappedWithMiddlewares);

  // todo: IF get/post
  // todo: set endopoint
  app.post("/api/v1/certificate", handlerWithMiddlewares);
};
