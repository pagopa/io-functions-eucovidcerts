import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
**German translation coming soon..**  
  
## Certificate of Exemption  
***  
**Subject exempt from SARS-CoV-2 vaccination**  
***  

Target disease or agent  
**${ee.tg}**  

Fiscal code of the certifying doctor  
**${ee.fc}**  
  
Certification validity start date  
**${formatDate(ee.df, fileLanguage)}**  

End of validity date of the certification, if applicable  
**${ee.du ? formatDate(ee.du, fileLanguage) : ""}**  

Unique vaccination exemption code (CUEV)  
**${ee.cu}**  

Certificate issuer  
**${formatCertificateIssuer(ee.is, fileLanguage)}**  

***  
*This certification is valid only in Italy and can be used in place of the COVID-19 green certification
for the performance of activities and the use of services in accordance with the provisions of the national legislation in force*
***  
  
For further information and privacy policy:  
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;
