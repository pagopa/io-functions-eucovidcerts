import {
  aValidAntigenTestCertificate,
  aValidMolecularTestCertificate,
  aValidRecoveryCertificate,
  aValidVaccinationCertificate
} from "../../__mocks__/certificates";
import {
  Certificates,
  VacCertificate,
  TestCertificate,
  RecoveryCertificate
} from "../certificate";
describe("certificates decoders", () => {
  it("should decode a vaccine only certificate", () => {
    const result = Certificates.decode(aValidVaccinationCertificate);
    expect(VacCertificate.is(result.value)).toBe(true);
    expect(TestCertificate.is(result.value)).toBe(false);
  });

  it("should decode a test only certificate (antigen)", () => {
    const result = Certificates.decode(aValidAntigenTestCertificate);
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(true);
  });

  it("should decode a test only certificate (molecular)", () => {
    const result = Certificates.decode(aValidMolecularTestCertificate);
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(true);
  });

  it("should decode a recovery certificate", () => {
    const result = Certificates.decode(aValidRecoveryCertificate);
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(false);
    expect(RecoveryCertificate.is(result.value)).toBe(true);
  });
});
