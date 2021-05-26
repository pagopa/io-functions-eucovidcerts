import { ResponseSuccessJson } from "@pagopa/ts-commons/lib/responses";

import { GetCertificateHandler } from "../handler";

describe("GetCertificate", () => {
  const aRevokedCertificate = {
    id: "000",
    revoke_reason: "bla bla bla",
    revoked_on: "1622041044426",
    status: "revoked"
  };

  it("should return a Certificate", async () => {
    expect.assertions(1);
    const val = await GetCertificateHandler()();
    console.log(val);
    expect(val).toEqual({
      apply: expect.any(Function),
      kind: "IResponseSuccessJson",
      value: aRevokedCertificate
    });
  });
});
