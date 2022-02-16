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
  ResponseErrorValidation,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { RequiredBodyPayloadMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/required_body_payload";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import { fromEither, tryCatch } from "fp-ts/lib/TaskEither";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { flow, pipe } from "fp-ts/lib/function";
import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { Context } from "@azure/functions";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { IResponseType } from "@pagopa/ts-commons/lib/requests";
import { StatusEnum } from "../generated/definitions/ValidCertificate";
import { Certificate } from "../generated/definitions/Certificate";
import { GetCertificateParams } from "../generated/definitions/GetCertificateParams";
import { Mime_typeEnum } from "../generated/definitions/QRCode";
import { toSHA256 } from "../utils/conversions";
import { createDGCClientSelector } from "../utils/dgcClientSelector";
import { toString } from "../utils/conversions";
import { StatusEnum as RevokedEnum } from "../generated/definitions/RevokedCertificate";
import { SearchSingleQrCodeResponseDTO } from "../generated/dgc/SearchSingleQrCodeResponseDTO";
import { parseQRCode } from "./parser";
import {
  printDetails,
  printExpiredOrRevokedInfo,
  printInfo,
  printUvci
} from "./printer";
import {
  getFallbackHeaderInfoForLanguage,
  getHeaderInfoForLanguage
} from "./certificate.headerInfo";

const LOG_PREFIX = "GetCertificateParams";
const EMPTY_STRING_FOR_MARKDOWN = " "; // Workaround to let App markdown rendering an empty string without errors

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

type ISuccessCertificateResponses = IResponseType<
  200 | 404,
  SearchSingleQrCodeResponseDTO,
  never
>;

export const processSuccessCertificateGeneration = (
  context: Context,
  selectedLanguage: O.Option<PreferredLanguageEnum>,
  e: ISuccessCertificateResponses
): TE.TaskEither<never, IResponseSuccessJson<Certificate>> =>
  pipe(
    e,
    TE.fromPredicate(
      i => i.status === 200,
      () => ({
        header_info: getFallbackHeaderInfoForLanguage(selectedLanguage),
        info:
          printExpiredOrRevokedInfo(selectedLanguage) ||
          EMPTY_STRING_FOR_MARKDOWN,
        status: RevokedEnum.revoked
      })
    ),
    TE.map(i => i.value),
    // try to enhance raw certificate with parsed data
    TE.map(
      ({
        data: { fglTipoDgc = undefined, qrcodeB64 = "", uvci = undefined } = {}
      }) => ({
        printedCertificate: pipe(
          parseQRCode(qrcodeB64, warning =>
            context.log.warn(`${LOG_PREFIX}|parseQRCode|${warning}`)
          ),
          E.mapLeft(_ => {
            context.log.error(
              `${LOG_PREFIX}|parseQRCode|unable to parse QRCode|${_.reason}`
            );
            return _;
          }),
          E.fold(
            _ => undefined,
            f => ({
              detail: printDetails(selectedLanguage, f, fglTipoDgc),
              header_info: getHeaderInfoForLanguage(selectedLanguage)(f),
              info: printInfo(selectedLanguage, f),
              uvci: printUvci(selectedLanguage, f)
            })
          )
        ),
        qrcodeB64,
        uvci
      })
    ),
    // compose a response payload
    TE.map(c => ({
      detail: c.printedCertificate?.detail,
      header_info:
        c.printedCertificate?.header_info ??
        getFallbackHeaderInfoForLanguage(selectedLanguage),
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
    TE.toUnion,
    T.map(ResponseSuccessJson),
    TE.rightTask
  );

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
    O.fromNullable,
    O.map(langs => langs.filter(PreferredLanguage.is)),
    O.chain(langs => (langs.length > 0 ? O.some(langs[0]) : O.none))
  );

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
            `${LOG_PREFIX}|dgcClient.getCertificateByAutAndCF|request failure|${failure.kind}`
          );
          return failure;
        })
      )
    ),

    // separates bad cases from success, and assign each failure its correct response
    TE.chain(e => {
      switch (e.status) {
        case 200:
        case 404:
          return processSuccessCertificateGeneration(
            context,
            selectedLanguage,
            e
          );
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
            `${LOG_PREFIX}|dgcClient.getCertificateByAutAndCF|unexpected status code|${unexpectedStatusCode}`
          );
          return assertNever(e);
        }
      }
    }),

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
