import { isRight } from "fp-ts/lib/Either";
import { Certificate } from "../../generated/definitions/Certificate";
import { StatusEnum as RevokedStatusEnum } from "../../generated/definitions/RevokedCertificate";

describe("Certificate", () => {
  it("should decode a revoked certificate", () => {
    const aRevokedCertificate = {
      id: "000",
      status: "revoked",
      revoke_reason: "bla bla bla",
      revoked_on: "2018-10-13T00:00:00.000Z"
    };

    const aRevokedCertificateDecoded = {
      id: "000",
      revoke_reason: "bla bla bla",
      revoked_on: new Date("2018-10-13T00:00:00.000Z"),
      status: RevokedStatusEnum.revoked
    };

    const res = Certificate.decode(aRevokedCertificate);
    expect(isRight(res)).toBe(true);
    expect(res.value).toEqual(aRevokedCertificateDecoded);
  });
});
