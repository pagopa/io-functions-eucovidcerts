import * as express from "express";
import * as t from "io-ts";

import {
  IRequestMiddleware,
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";

import { FiscalCodeMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/fiscalcode";

import {
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseSuccessJson,
  ResponseErrorFromValidationErrors,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";

const NewMessage = t.any;
type NewMessage = t.TypeOf<typeof NewMessage>;

type ResponseStub = t.TypeOf<typeof ResponseStub>;
const ResponseStub = t.interface({
  id: t.string
});

type ISubmitMessageHandler = (
  fiscalCode: FiscalCode,
  newMessage: NewMessage
) => Promise<
  | IResponseSuccessJson<ResponseStub>
  | IResponseErrorInternal
  | IResponseErrorValidation
>;

export const getSubmitMessageForUserHandler = (): ISubmitMessageHandler => async (
  _fiscalCode: FiscalCode,
  _newMessage: NewMessage
): Promise<IResponseSuccessJson<ResponseStub>> =>
  Promise.resolve(
    ResponseSuccessJson<ResponseStub>({ id: "000001" })
  );

export const MessagePayloadMiddleware: IRequestMiddleware<
  "IResponseErrorValidation",
  NewMessage
> = request =>
  new Promise(resolve =>
    resolve(
      NewMessage.decode(request.body).mapLeft(
        ResponseErrorFromValidationErrors(NewMessage)
      )
    )
  );

export const getSubmitMessageForUserAsExpressHandler = (): express.RequestHandler => {
  const handler = getSubmitMessageForUserHandler();
  const middlewaresWrap = withRequestMiddlewares(
    FiscalCodeMiddleware,
    MessagePayloadMiddleware
  );
  return wrapRequestHandler(middlewaresWrap(handler));
};
