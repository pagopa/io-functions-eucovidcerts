import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";

import {
  formatCertificateIssuer,
  ITALY_HEALTHCARE_ISSUER,
  HEALTHCARE_DEP_IT,
  HEALTHCARE_DEP_EN,
  HEALTHCARE_DEP_DE,
  getPrinterForLanguage,
  defaultPrinter
} from "../printer";

describe("Printer", () => {
  it("should format Certificate Issuer with Ministero della salute if value is IT and language it_IT", () => {
    const result = formatCertificateIssuer(
      ITALY_HEALTHCARE_ISSUER,
      PreferredLanguageEnum.it_IT
    );
    expect(result).toEqual(HEALTHCARE_DEP_IT);
  });

  it("should format Certificate Issuer with Ministry of Health if value is IT and language is en_EN", () => {
    const result = formatCertificateIssuer(
      ITALY_HEALTHCARE_ISSUER,
      PreferredLanguageEnum.en_GB
    );
    expect(result).toEqual(HEALTHCARE_DEP_EN);
  });

  it("should format Certificate Issuer with Ministry of Health if value is IT and language is de_DE", () => {
    const result = formatCertificateIssuer(
      ITALY_HEALTHCARE_ISSUER,
      PreferredLanguageEnum.de_DE
    );
    expect(result).toEqual(HEALTHCARE_DEP_DE);
  });

  it("should format Certificate Issuer with its value if value is different from IT and language it_IT", () => {
    const result = formatCertificateIssuer(
      "a value",
      PreferredLanguageEnum.en_GB
    );
    expect(result).toEqual("a value");
  });

  it("should get defaultPrinter if prefererred language is not supported", () => {
    const result = getPrinterForLanguage(some(PreferredLanguageEnum.fr_FR));
    expect(result).toBe(defaultPrinter);
  });
});
