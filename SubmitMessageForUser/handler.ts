import * as express from "express";
import * as t from "io-ts";
import * as te from "fp-ts/lib/TaskEither";

import {
  IResponseErrorInternal,
  IResponseErrorValidation,
  ResponseErrorGeneric,
  IResponseErrorGeneric,
  ResponseErrorFromValidationErrors
} from "@pagopa/ts-commons/lib/responses";

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { Response } from "node-fetch";
import { IServiceClient } from "../utils/serviceClient";

type FiscalCodeBearer = t.TypeOf<typeof FiscalCodeBearer>;
const FiscalCodeBearer = t.interface({
  fiscal_code: FiscalCode
});

export const submitMessageForUser = (
  client: IServiceClient,
  request: express.Request
): te.TaskEither<
  IResponseErrorInternal | IResponseErrorValidation | IResponseErrorGeneric,
  Response
> =>
  te
    .fromEither<
      IResponseErrorValidation | IResponseErrorInternal | IResponseErrorGeneric,
      FiscalCodeBearer
    >(
      FiscalCodeBearer.decode(request.body).mapLeft(
        ResponseErrorFromValidationErrors(FiscalCodeBearer)
      )
    )
    .chain(fc =>
      client.getLimitedProfileByPost(request.headers, fc.fiscal_code)
    )
    .filterOrElse(
      profile => profile.sender_allowed,
      ResponseErrorGeneric(403, "403 Forbidden", "")
    )
    .chain(_ => client.submitMessageForUser(request.headers, request.body));

export const getSubmitMessageForUserHandler = (
  client: IServiceClient
): express.RequestHandler => async (request, response): Promise<void> => {
  const aa = await submitMessageForUser(client, request).run();
  if (aa.isRight()) {
    for (const pair of aa.value.headers.entries()) {
      response.setHeader(pair[0], pair[1]);
    }
    response.json(await aa.value.json());
    response.sendStatus(aa.value.status);
  } else {
    aa.value.apply(response);
  }
};
