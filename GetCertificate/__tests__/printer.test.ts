import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";

import { Certificates } from "../certificate";
import { printDetails, printInfo, formatCertificateIssuer } from "../printer";

describe("Printer", () => {
  it("should format Certificate Issuer with Ministero della salute if value is IT and language it_IT", () => {
    const result = formatCertificateIssuer("IT", PreferredLanguageEnum.it_IT);
    expect(result).toEqual("Ministero della Salute");
  });
  it("should format Certificate Issuer with Ministry of Health if value is IT and language it_IT", () => {
    const result = formatCertificateIssuer("IT", PreferredLanguageEnum.en_GB);
    expect(result).toEqual("Ministry of Health");
  });
  it("should format Certificate Issuer with its value if value is different from IT and language it_IT", () => {
    const result = formatCertificateIssuer(
      "a value",
      PreferredLanguageEnum.en_GB
    );
    expect(result).toEqual("a value");
  });
});
