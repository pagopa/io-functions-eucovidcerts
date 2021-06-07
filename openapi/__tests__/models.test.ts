import { isRight } from "fp-ts/lib/Either";
import { Certificate } from "../../generated/definitions/Certificate";
import {
  RevokedCertificate,
  StatusEnum as RevokedStatusEnum
} from "../../generated/definitions/RevokedCertificate";

describe("Certificate", () => {
  it("should decode a revoked certificate", () => {
    const aRevokedCertificate = {
      uvci: "000",
      status: "revoked",
      info: "bla bla bla",
      revoked_on: "2018-10-13T00:00:00.000Z"
    };

    const aRevokedCertificateDecoded: RevokedCertificate = {
      uvci: "000",
      info: "bla bla bla",
      revoked_on: new Date("2018-10-13T00:00:00.000Z"),
      status: RevokedStatusEnum.revoked
    };

    const res = Certificate.decode(aRevokedCertificate);
    expect(isRight(res)).toBe(true);
    expect(res.value).toEqual(aRevokedCertificateDecoded);
  });
});
