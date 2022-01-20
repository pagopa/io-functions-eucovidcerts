import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
## Digital COVID-19 vaccination exemption certificate  
***  
**VALID ONLY IN ITALY**  
***  

Disease or agent targeted  
**${ee.tg}**  

Fiscal code of the certifying physician  
**${ee.fc}**  
  
Valid from  
**${formatDate(ee.df, fileLanguage)}**  

Valid until  
**${formatDate(ee.du, fileLanguage)}**  

Unique vaccination exemption code (CUEV)  
**${ee.cu}**  

Certificate issuer  
**${formatCertificateIssuer(ee.is, fileLanguage)}**  

***  
*This certificate is valid only in Italy and can be used to replace the Digital 
COVID Certificate to access services and activities in accordance with the current national legislation.*  
***  
  
For further information and privacy policy:  
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;
