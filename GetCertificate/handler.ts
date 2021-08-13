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
  ResponseErrorInternal,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { fromEither, tryCatch } from "fp-ts/lib/TaskEither";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { ResponseErrorValidation } from "@pagopa/ts-commons/lib/responses";
import { flow, pipe } from "fp-ts/lib/function";
import { PreferredLanguage } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { Context } from "@azure/functions";
import * as o from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { StatusEnum } from "../generated/definitions/ValidCertificate";
import { Certificate } from "../generated/definitions/Certificate";
import { GetCertificateParams } from "../generated/definitions/GetCertificateParams";
import { Mime_typeEnum } from "../generated/definitions/QRCode";
import { toSHA256 } from "../utils/conversions";
import { createDGCClientSelector } from "../utils/dgcClientSelector";
import { toString } from "../utils/conversions";
import { parseQRCode } from "./parser";
import { printDetails, printInfo, printUvci } from "./printer";

const assertNever = (x: never): never => {
  throw new Error(`Unexpected object: ${toString(x)}`);
};

type Failures =
  | IResponseErrorInternal
  | IResponseErrorValidation
  | IResponseErrorForbiddenNotAuthorized;
type GetCertificateHandler = (
  context: Context,
  params: GetCertificateParams
) => Promise<IResponseSuccessJson<Certificate> | Failures>;
// eslint-disable-next-line max-lines-per-function
export const GetCertificateHandler = (
  dgcClientSelector: ReturnType<typeof createDGCClientSelector>
  // eslint-disable-next-line max-lines-per-function
): GetCertificateHandler => async (
  context,
  { fiscal_code, auth_code: authCodeSHA256, preferred_languages }
): Promise<IResponseSuccessJson<Certificate> | Failures> => {
  // prints a certificate into huma nreadable text - italian only for now
  //  const printer = printers[PreferredLanguageEnum.it_IT];
  const hashedFiscalCode = toSHA256(fiscal_code);
  const selectedLanguage = pipe(
    preferred_languages,
    o.fromNullable,
    o.map(langs => langs.filter(PreferredLanguage.is)),
    o.chain(langs => (langs.length > 0 ? o.some(langs[0]) : o.none))
  );

  const logPrefix = "GetCertificateParams";

  return pipe(
    hashedFiscalCode,
    TE.of,
    TE.map(hasedFc => dgcClientSelector.select(hasedFc)),
    // wraps http request and handles generic exceptions
    TE.chain(dgcClient =>
      pipe(
        tryCatch(
          () =>
            dgcClient
              .getCertificateByAutAndCF({
                body: {
                  authCodeSHA256,
                  cfSHA256: hashedFiscalCode
                }
              })
              // this happens when the response payload cannot be parsed
              .then(
                flow(E.mapLeft(e => ResponseErrorInternal(readableReport(e))))
              ),
          // this is an unhandled error during connection - it might be timeout
          _ => ResponseErrorInternal(E.toError(_).message)
        ),
        TE.chain(fromEither),
        TE.mapLeft(failure => {
          context.log.error(
            `${logPrefix}|dgcClient.getCertificateByAutAndCF|request failure|${failure.kind}`
          );
          return failure;
        })
      )
    ),
    x => x,
    // separates bad cases from success, and assign each failure its correct response
    TE.chain(e => {
      switch (e.status) {
        case 200:
          return TE.of(e.value);
        case 400:
          return TE.left(
            ResponseErrorValidation("Bad Request", "") as Failures
          );
        case 500:
          return TE.left(ResponseErrorInternal(toString(e.value)) as Failures);
        default: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unexpectedStatusCode = (e as any)?.status ?? "";
          context.log.error(
            `${logPrefix}|dgcClient.getCertificateByAutAndCF|unexpected status code|${unexpectedStatusCode}`
          );
          return assertNever(e);
        }
      }
    }),
    // try to enhance raw certificate with parsed data
    TE.map(({ data: { qrcodeB64 = "", uvci = undefined } = {} }) => ({
      printedCertificate: pipe(
        parseQRCode(qrcodeB64, warning =>
          context.log.warn(`${logPrefix}|parseQRCode|${warning}`)
        ),
        E.mapLeft(_ => {
          context.log.error(
            `${logPrefix}|parseQRCode|unable to parse QRCode|${_.reason}`
          );
          return _;
        }),
        E.fold(
          _ => undefined,
          f => ({
            detail: printDetails(selectedLanguage, f),
            info: printInfo(selectedLanguage, f),
            uvci: printUvci(selectedLanguage, f)
          })
        )
      ),
      qrcodeB64,
      uvci
    })),
    // compose a response payload
    TE.map(c => ({
      detail: c.printedCertificate?.detail,
      info: c.printedCertificate?.info,
      qr_code: {
        content: c.qrcodeB64,
        mime_type: Mime_typeEnum["image/png"]
      },
      status: StatusEnum.valid,
      // if we successful pardsed the qr code, we retrieve the identifier from the parsing
      //   otherwise we retrieve the identifier eventually received from DGC
      uvci: c.printedCertificate?.uvci || c.uvci
    })),
    TE.map(ResponseSuccessJson),
    // fold failures and success cases into a single response pipeline
    TE.toUnion
  )();
};

export const getGetCertificateHandler = (
  dgcClientSelector: ReturnType<typeof createDGCClientSelector>
): express.RequestHandler => {
  const handler = GetCertificateHandler(dgcClientSelector);

  return wrapRequestHandler(
    withRequestMiddlewares(
      ContextMiddleware(),
      RequiredBodyPayloadMiddleware(GetCertificateParams)
    )(handler)
  );
};
