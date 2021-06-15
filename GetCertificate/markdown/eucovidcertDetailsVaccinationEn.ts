import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { VaccinationEntry } from "../certificate";
import {
  formatCertificateIssuer,
  formatDate,
  isVaccinationProcessEnded
} from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (v: VaccinationEntry): string =>
  `
## Vaccination Certificate  
***
${isVaccinationProcessEnded(v)
    ? "**Certification valid for 270 days (9 months) from the date of the last administration**"
    : "**Certification valid until next dose**"
  }
***

Disease or agent targeted  
**${v.tg}**  

Vaccine/prophylaxis  
**${v.vp}**  

Vaccine medicinal product  
**${v.mp}**   

Vaccine marketing authorisation holder or manufacturer  
**${v.ma}**  

Number in a series of vaccinations doses / overall number of vaccination in the series  
**${v.dn} / ${v.sd}**  

Date of vaccination  
**${formatDate(v.dt, fileLanguage)}**  

Member State of vaccination  
**${v.co}**

Certificate issuer  
**${formatCertificateIssuer(v.is, fileLanguage)}**  

Unique certificate identifier  
**${v.ci}**  

***

*This certificate is not a travel document.  
The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)
`;
