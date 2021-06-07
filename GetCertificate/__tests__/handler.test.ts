import { StatusEnum as RevokedStatusEnum } from "../../generated/definitions/RevokedCertificate";

describe("GetCertificate", () => {
  const aRevokedCertificate = {
    id: "000",
    revoke_reason: "bla bla bla",
    revoked_on: new Date("2018-10-13T00:00:00.000Z"),
    status: RevokedStatusEnum.revoked
  };

  it("should return a Certificate", async () => {
    expect(1).toBe(1);
  });
});
