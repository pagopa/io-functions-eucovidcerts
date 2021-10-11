import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isSome } from "fp-ts/lib/Option";
import { TestEntry } from "../certificate";
import {
  formatCertificateIssuer,
  formatDateAndTime,
  testValidity
} from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (te: TestEntry): string =>
  `
## Test Certificate
***
**Certification valid for ${testValidity(
    te
  )} hours from the time of collection**
***

Disease or agent targeted  
**${te.tg}**  

Type of Test  
**${te.tt.displays[fileLanguage]}**  

Result of the test  
**${te.tr.displays[fileLanguage]}**  

${te.nm ? `NAA test name  ` : ""}
${te.nm ? `**${te.nm}**  ` : ""}

${te.ma && isSome(te.ma) ? `RAT test name and manufacturer  ` : ""}
${te.ma && isSome(te.ma) ? `**${te.ma.value}**  ` : ""}

Date and time of the test sample collection  
**${formatDateAndTime(te.sc, fileLanguage)}**  

${te.dr ? `Date and time of the test result production  ` : ""}
${te.dr ? `**${formatDateAndTime(te.dr, fileLanguage)}**  ` : ""}

Testing centre or facility  
**${te.tc}**  

State of test  
**${te.co}**  

Certificate issuer  
**${formatCertificateIssuer(te.is, fileLanguage)}**  

Unique certificate identifier  
**${te.ci}**
  
***

*This certificate is not a travel document.   
The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)
<br/><br/><br/><br/><br/>
`;
