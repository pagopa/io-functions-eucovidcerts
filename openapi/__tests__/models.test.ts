import { isRight } from "fp-ts/lib/Either";
import { Certificate } from "../../generated/dgc/Certificate";

describe("Certificate", () => {
  it("should decode a revoked certificate", () => {
    const aRevokedCertificate = {
      id: "000",
      status: "revoked",
      revoke_reason: "bla bla bla",
      revoked_on: Date.now().toString()
    };

    const res = Certificate.decode(aRevokedCertificate);
    expect(isRight(res)).toBe(true);
    expect(res.value).toEqual(aRevokedCertificate);
  });
});
