import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isSome } from "fp-ts/lib/Option";
import { TestEntry } from "../certificate";
import {
  formatCertificateIssuer,
  formatDate,
  formatUvci
} from "../printer.helpers";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (te: TestEntry): string =>
  `
## Test Certificate
***
**Certification valid for 48 hours from the time of collection**
***

Disease or agent targeted  
**${te.tg.displays.get(fileLanguage)}**  

Type of Test  
**${te.tt.displays.get(fileLanguage)}**  

Result of the test  
**${te.tr.displays.get(fileLanguage)}**  

${te.nm ? `NAA test name  ` : ""}
${te.nm ? `**${te.nm}**  ` : ""}

${te.ma && isSome(te.ma) ? `RAT test name and manufacturer  ` : ""}
${
  te.ma && isSome(te.ma)
    ? `**${te.ma.value.displays.get(fileLanguage)}**  `
    : ""
}

Date and time of the test sample collection  
**${formatDate(te.sc, fileLanguage)}**  

${te.dr ? `Date and time of the test result production  ` : ""}
${te.dr ? `**${formatDate(te.dr, fileLanguage)}**  ` : ""}

Testing centre or facility  
**${te.tc}**  

Member State of test  
**${te.co}**  

Certificate issuer  
**${formatCertificateIssuer(te.is, fileLanguage)}**  

Unique certificate identifier  
**${formatUvci(te.ci)}**  
  
***

*This certificate is not a travel document.   
The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)
`;
