import * as express from "express";

import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorForbiddenNotAuthorized,
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseSuccessJson,
  ResponseErrorForbiddenNotAuthorized,
  ResponseErrorInternal,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import {
  fromEither,
  fromLeft,
  taskEither,
  tryCatch
} from "fp-ts/lib/TaskEither";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { ResponseErrorValidation } from "@pagopa/ts-commons/lib/responses";
import { identity, toString } from "fp-ts/lib/function";
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { Context } from "@azure/functions";
import { TypeofApiCall } from "@pagopa/ts-commons/lib/requests";
import { Either, toError } from "fp-ts/lib/Either";
import { Validation } from "io-ts";
import { StatusEnum } from "../generated/definitions/ValidCertificate";
import { GetCertificateParams } from "../generated/definitions/GetCertificateParams";
import { Client as DGCClient } from "../generated/dgc/client";
import { Certificate } from "../generated/definitions/Certificate";
import { Mime_typeEnum } from "../generated/definitions/QRCode";
import { GetCertificateT } from "../generated/dgc/requestTypes";
import { RawCertificate } from "../generated/dgc/RawCertificate";
import { parseQRCode, printers } from "./certificate";

const assertNever = (x: never): never => {
  throw new Error(`Unexpected object: ${toString(x)}`);
};

type DGCGetCertificateResponses = ReturnType<
  TypeofApiCall<GetCertificateT>
> extends Promise<Validation<infer Y>>
  ? Y
  : never;

type Failures =
  | IResponseErrorInternal
  | IResponseErrorValidation
  | IResponseErrorForbiddenNotAuthorized;
type GetCertificateHandler = (
  context: Context,
  params: GetCertificateParams
) => Promise<IResponseSuccessJson<Certificate> | Failures>;
export const GetCertificateHandler = (
  dgcClient: DGCClient
): GetCertificateHandler => async (
  _context,
  { fiscal_code, auth_code }
): Promise<IResponseSuccessJson<Certificate> | Failures> => {
  // prints a certificate into huma nreadable text - italian only for now
  const printer = printers[PreferredLanguageEnum.it_IT];

  // wraps http request and handles generic exceptions
  const certificateResponse = tryCatch<
    Failures,
    Either<IResponseErrorInternal, DGCGetCertificateResponses>
  >(
    () =>
      dgcClient
        .getCertificate({
          accessData: {
            auth_code,
            fiscal_code
          }
        })
        // this happens when the response payload cannot be parsed
        .then(_ => _.mapLeft(e => ResponseErrorInternal(readableReport(e)))),
    // this is an unhandled error during connection - it might be timeout
    _ => ResponseErrorInternal(toError(_).message)
  ).chain(fromEither);

  return (
    certificateResponse
      // separates bad cases from success, and assign each failure its correct response
      .chain<RawCertificate>(e => {
        switch (e.status) {
          case 200:
            return taskEither.of(e.value);
          case 400:
            return fromLeft(ResponseErrorValidation("Bad Request", ""));
          case 403:
            return fromLeft(ResponseErrorForbiddenNotAuthorized);
          case 500:
            return fromLeft(ResponseErrorInternal(toString(e.value)));
          default:
            return assertNever(e);
        }
      })
      // try to enhance raw certificate with parsed data
      .map(({ qr_code: rawQRCode }) => ({
        printedCertificate: parseQRCode(rawQRCode).fold(
          _ => undefined,
          f => ({
            detail: printer.detail(f),
            id: f.id,
            info: printer.info(f)
          })
        ),
        rawQRCode
      }))
      // compose a response payload
      .map<Certificate>(e => ({
        detail: e.printedCertificate?.detail,
        id: e.printedCertificate?.id,
        info: e.printedCertificate?.info,
        qr_code: {
          content: e.rawQRCode,
          mime_type: Mime_typeEnum["image/png"]
        },
        status: StatusEnum.valid
      }))
      .map(ResponseSuccessJson)
      // fold failures and success cases into a single response pipeline
      .fold<IResponseSuccessJson<Certificate> | Failures>(identity, identity)
      .run()
  );
};

export const getGetCertificateHandler = (
  dgcClient: DGCClient
): express.RequestHandler => {
  const handler = GetCertificateHandler(dgcClient);

  return wrapRequestHandler(
    withRequestMiddlewares(
      ContextMiddleware(),
      RequiredBodyPayloadMiddleware(GetCertificateParams)
    )(handler)
  );
};
