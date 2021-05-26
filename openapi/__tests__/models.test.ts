import { isRight } from "fp-ts/lib/Either";
import { Certificate } from "../../generated/dgc/Certificate";

describe("Certificate", () => {
  it("should decode valid expired certificate", () => {
    const anExpiredCertificate = {
      id: "000",
      markdown: "bla bla bla",
      status: "expired",
      valid_until: Date.now().toString()
    };

    const res = Certificate.decode(anExpiredCertificate);
    expect(isRight(res)).toBe(true);
    expect(res.value).toEqual(anExpiredCertificate);
  });
});
