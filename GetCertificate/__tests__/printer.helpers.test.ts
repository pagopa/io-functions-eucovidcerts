import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";

import {
  formatCertificateIssuer,
  ITALY_HEALTHCARE_ISSUER,
  HEALTHCARE_DEP_IT,
  HEALTHCARE_DEP_EN,
  formatUvci
} from "../printer.helpers";

describe("Printers - Certificate Issuer", () => {
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

describe("Printers - Two Lines UVCI", () => {
  it("should format UVCI in two lines - even", () => {
    const uvci = "01IT0BFC9866D3854EAC82C21654B6F6DE32#1";
    const result = formatUvci(uvci);
    expect(result).toEqual("01IT0BFC9866D3854EAC82C21654B6F6DE32#1");
  });

  // NOTE: This will be used if we need to split in two lines
  // it("should format UVCI in two lines - even", () => {
  //   const uvci = "01IT0BFC9866D3854EAC82C21654B6F6DE32#1";
  //   const result = formatUvci(uvci);
  //   expect(result).toEqual("01IT0BFC9866D3854EA  \nC82C21654B6F6DE32#1");
  // });

  // it("should format UVCI in two lines - odd", () => {
  //   const uvci = "A01IT0BFC9866D3854EAC82C21654B6F6DE32#1";
  //   const result = formatUvci(uvci);
  //   expect(result).toEqual("A01IT0BFC9866D3854E  \nAC82C21654B6F6DE32#1");
  // });

  // it("should format UVCI in two lines - empty", () => {
  //   const uvci = "";
  //   const result = formatUvci(uvci);
  //   expect(result).toEqual("  \n");
  // });
});
