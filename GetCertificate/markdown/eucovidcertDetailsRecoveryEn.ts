import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { CBisCertificateTypeEnrichment, RecoveryEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (
  tr: RecoveryEntry,
  certificateTypeEnrichment?: string
): string =>
  `
## Recovery Certificate  
***
${
  CBisCertificateTypeEnrichment.is(certificateTypeEnrichment)
    ? `**Certification valid in the European Union until the date of end of validity and valid in Italy from the validity start date without the need for additional doses, unless regulatory changes. further doses of recall, subject to regulatory changes. 
    For technical reasons, a new QR code may be issued 18 months (540 days) from the validity start date**`
    : "**Certificate valid in the European Union up to the end date of validity, and in Italy for 180 days (6 months) from the start date of validity.**"
}
***  

Disease or agent the citizen has recovered from  
**${tr.tg}**  

Date of first positive NAAT test result  
**${formatDate(tr.fr, fileLanguage)}**  

State of test  
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
<br/><br/><br/><br/><br/>
`;
