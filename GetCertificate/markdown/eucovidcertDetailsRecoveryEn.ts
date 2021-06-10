import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { RecoveryEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (tr: RecoveryEntry): string =>
  `
## Recovery Certificate  

Disease or agent the citizen has recovered from  
**${tr.tg.displays.get(fileLanguage)}**  

Date of first positive NAAT test result  
**${formatDate(tr.fr, fileLanguage)}**  

Member State of test  
**${tr.co}**  

Certificate issuer  
  **${formatCertificateIssuer(tr.is, fileLanguage)}**  
  
Certificate valid From  
**${formatDate(tr.df, fileLanguage)}**  
  
Certificate valid Until  
**${formatDate(tr.du, fileLanguage)}**  

***
  
*This certificate is not a travel document.  
The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)
`;
