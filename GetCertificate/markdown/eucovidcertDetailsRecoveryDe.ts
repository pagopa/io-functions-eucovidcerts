import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { RecoveryEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;

export const getDetailPrinter = (tr: RecoveryEntry): string =>
  `
## Heilungsurkunde

Zielkrankheit oder Erreger, von dem die Person geheilt wird  
**${tr.tg}**  

Datum des ersten positiven Molekulartests  
**${formatDate(tr.fr, fileLanguage)}**  

Zustand, in dem der erste positive Molekulartest durchgeführt wurde  
**${tr.co}**  

Subjekt, das die Zertifizierung ausgestellt hat  
**${formatCertificateIssuer(tr.is, fileLanguage)}**  
 
Zertifizierung gültig ab  
**${formatDate(tr.df, fileLanguage)}**  

Zertifizierung gültig bis  
**${formatDate(tr.du, fileLanguage)}**  

***

*Diese Bescheinigung ist kein Reisedokument.  
Die wissenschaftlichen Erkenntnisse zu COVID-19-Impfung, -Tests und -Wiederherstellung entwickeln sich weiter, auch unter Berücksichtigung der neuen Varianten des Virus.*  
*Bitte informieren Sie sich vor der Reise über die am Zielort geltenden Gesundheitsmaßnahmen und die damit verbundenen Einschränkungen auch auf der Website:*   
[https://reopen.europa.eu/it](https://reopen.europa.eu/it)
  
***
  
Weitere Informationen und den Download des Zertifikats im druckfähigen PDF-Format finden Sie der Website  
[www.dgc.gov.it](https://www.dgc.gov.it)
<br/><br/><br/><br/><br/>
`;
