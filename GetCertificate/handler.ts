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
import { Certificate } from "../generated/dgc/Certificate";

// type IProva = t.TypeOf<typeof IProva>;

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
        markdown: "bla bla bla",
        status: "expired",
        valid_until: Date.now().toString()
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
