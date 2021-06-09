import { getSubmitMessageForUserHandler } from "../handler";
import { IServiceClient, createClient } from '../../utils/serviceClient';
import * as te from "fp-ts/lib/TaskEither";
import { LimitedProfile } from "@pagopa/io-functions-commons/dist/generated/definitions/LimitedProfile";
import { ResponseErrorInternal } from "@pagopa/ts-commons/lib/responses";
import { toError } from "fp-ts/lib/Either";
import { Response } from "node-fetch";
import * as express from 'express';
// import { getMockReq, getMockRes } from '@jest-mock/express'
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";


// export const createDummyServiceClient = (): IServiceClient => ({
//   getLimitedProfileByPost: (
//     reqHeaders,
//     fiscalCode
//   ): ReturnType<IServiceClient["getLimitedProfileByPost"]> =>
//   te.fromEither(
//     LimitedProfile.decode({sender_allowed: true}).mapLeft(validationErrors =>
//       ResponseErrorInternal(validationErrors.toString())
//     )
//   ),
//   submitMessageForUser: (
//       reqHeaders,
//       reqPayload
//     ): ReturnType<IServiceClient["submitMessageForUser"]> =>
//       te.tryCatch(
//         () =>
//           Promise.resolve(new Response(JSON.stringify({id: "0000001"}))),
//         e => ResponseErrorInternal(toError(e).message)
//       )
// });


describe("SubmitMessageForUser", () => {
  const newMessageCreated = {
    id: "0000001"
  };

  it("should return an id", async () => {
//    expect.assertions(1);
    //const res = mockRes();
    // const req = getMockReq({body: {fiscal_code: "PPAFRZ87L02A132W"}});
    // getSubmitMessageForUserHandler(createDummyServiceClient())(req, res, ()=>null);
    // const response = res;
    // console.log(response)
    // expect(val).toEqual({
    //   apply: expect.any(Function),
    //   kind: "IResponseSuccessJson",
    //   value: aRevokedCertificate
    // });
  });


//   it("should copy all the request headers", async () => {
//     //    expect.assertions(1);
//         const req = getMockReq({
//           headers: {"x-subscriptions-id": "test-sub-1"},
//           body: {fiscal_code: "PPAFRZ87L02A132W"}
//         });
//         const { res, next, clearMockRes } = getMockRes()
//         getSubmitMessageForUserHandler(createDummyServiceClient())(req, res, next);
//         const response = res.get();
//         console.log(response)
        
//       });

//       it("should return a limited profile with soapui", async () => {
//         const client = createClient("http://localhost:7073", "aaaaaa");
//         const res = await client.getLimitedProfileByPost([] as unknown as NodeJS.Dict<string | ReadonlyArray<string>>, "PPAFRZ87L02A132W" as FiscalCode).run();
//         console.log(res);
//       });
//       it("should return an id with soapui", async () => {
//         const client = createClient("http://localhost:7073", "aaaaaa");
//         const res = await client.submitMessageForUser([] as unknown as NodeJS.Dict<string | ReadonlyArray<string>>, {} as Response).run();
//         if (res.isRight()) {
//           console.log(await res.value.json());
//         } else {
//           console.log(res.value);
//         }
//       });
});
