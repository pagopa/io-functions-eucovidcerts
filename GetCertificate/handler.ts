import * as express from "express";
import { taskEither } from "fp-ts/lib/TaskEither";
import { toString } from "fp-ts/lib/function";

import { wrapRequestHandler } from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorInternal,
  IResponseSuccessJson,
  ResponseSuccessJson,
  ResponseErrorInternal
} from "@pagopa/ts-commons/lib/responses";
import { Certificate } from "../generated/definitions/Certificate";

type GetCertificateHandler = () => Promise<
  IResponseSuccessJson<Certificate> | IResponseErrorInternal
>;
export const GetCertificateHandler = (): GetCertificateHandler => (): Promise<
  IResponseSuccessJson<Certificate> | IResponseErrorInternal
> =>
  taskEither
    .fromEither(
      Certificate.decode({
        id: "000",
        revoke_reason: "bla bla bla",
        revoked_on: "2018-10-13T00:00:00.000Z",
        status: "revoked"
      })
    )
    .fold<IResponseSuccessJson<Certificate> | IResponseErrorInternal>(
      _ => ResponseErrorInternal(toString(_)),
      ok => ResponseSuccessJson(ok)
    )
    .run();

export const getGetCertificateHandler = (): express.RequestHandler => {
  const handler = GetCertificateHandler();

  return wrapRequestHandler(handler);
};
