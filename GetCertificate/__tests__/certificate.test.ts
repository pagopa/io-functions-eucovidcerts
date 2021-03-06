import {
  aValidAntigenTestCertificate,
  aValidExemptionCertificateWithEndDate,
  aValidMolecularTestCertificate,
  aValidRecoveryCertificate,
  aValidVaccinationCertificate
} from "../../__mocks__/certificates";
import {
  Certificates,
  VacCertificate,
  TestCertificate,
  RecoveryCertificate,
  ExemptionCertificate
} from "../certificate";

describe("certificates decoders", () => {
  it("should decode a vaccine only certificate", () => {
    const result = Certificates.decode(aValidVaccinationCertificate);
    expect(VacCertificate.is((result as any).right)).toBe(true);
    expect(TestCertificate.is((result as any).right)).toBe(false);
    expect(RecoveryCertificate.is((result as any).right)).toBe(false);
    expect(ExemptionCertificate.is((result as any).right)).toBe(false);
  });

  it("should decode a test only certificate (antigen)", () => {
    const result = Certificates.decode(aValidAntigenTestCertificate);
    expect(VacCertificate.is((result as any).right)).toBe(false);
    expect(TestCertificate.is((result as any).right)).toBe(true);
    expect(RecoveryCertificate.is((result as any).right)).toBe(false);
    expect(ExemptionCertificate.is((result as any).right)).toBe(false);
  });

  it("should decode a test only certificate (molecular)", () => {
    const result = Certificates.decode(aValidMolecularTestCertificate);
    expect(VacCertificate.is((result as any).right)).toBe(false);
    expect(TestCertificate.is((result as any).right)).toBe(true);
    expect(RecoveryCertificate.is((result as any).right)).toBe(false);
    expect(ExemptionCertificate.is((result as any).right)).toBe(false);
  });

  it("should decode a recovery certificate", () => {
    const result = Certificates.decode(aValidRecoveryCertificate);
    expect(VacCertificate.is((result as any).right)).toBe(false);
    expect(TestCertificate.is((result as any).right)).toBe(false);
    expect(RecoveryCertificate.is((result as any).right)).toBe(true);
    expect(ExemptionCertificate.is((result as any).right)).toBe(false);
  });

  it("should decode an exemption certificate", () => {
    const result = Certificates.decode(aValidExemptionCertificateWithEndDate);
    expect(VacCertificate.is((result as any).right)).toBe(false);
    expect(TestCertificate.is((result as any).right)).toBe(false);
    expect(RecoveryCertificate.is((result as any).right)).toBe(false);
    expect(ExemptionCertificate.is((result as any).right)).toBe(true);
  });
});
