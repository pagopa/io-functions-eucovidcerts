import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";

import {
  formatCertificateIssuer,
  ITALY_HEALTHCARE_ISSUER,
  HEALTHCARE_DEP_IT,
  HEALTHCARE_DEP_EN
} from "../printer";

describe("Printer", () => {
  it("should format Certificate Issuer with Ministero della salute if value is IT and language it_IT", () => {
    const result = formatCertificateIssuer(
      ITALY_HEALTHCARE_ISSUER,
      PreferredLanguageEnum.it_IT
    );
    expect(result).toEqual(HEALTHCARE_DEP_IT);
  });

  it("should format Certificate Issuer with Ministry of Health if value is IT and language not it_IT", () => {
    const result = formatCertificateIssuer(
      ITALY_HEALTHCARE_ISSUER,
      PreferredLanguageEnum.fr_FR
    );
    expect(result).toEqual(HEALTHCARE_DEP_EN);
  });
  it("should format Certificate Issuer with its value if value is different from IT and language it_IT", () => {
    const result = formatCertificateIssuer(
      "a value",
      PreferredLanguageEnum.en_GB
    );
    expect(result).toEqual("a value");
  });
});