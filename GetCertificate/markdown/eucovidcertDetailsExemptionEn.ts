import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
## Certificate of Exemption  
***  
**Subject exempt from SARS-CoV-2 vaccination**  
***  

Target disease or agent  
**${ee.tg}**  

Fiscal code of the certifying doctor  
**TODO**  
  
Certification validity start date  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    // formatDate(ee.df, fileLanguage)
  }**  

End of validity date of the certification, if applicable  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    /* formatDate(ee.du, fileLanguage) */
  }**  

Unique vaccination exemption code (CUEV)  
**TODO**  

Certificate issuer  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    // formatCertificateIssuer(tr.is, fileLanguage)
  }**  

***  
*This certification is valid only in Italy and can be used in place of the COVID-19 green certification
for the performance of activities and the use of services in accordance with the provisions of the national legislation in force*
***  
  
For further information and privacy policy:  
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;