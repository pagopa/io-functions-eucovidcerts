import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isSome } from "fp-ts/lib/Option";
import { TestEntry } from "../certificate";
import {
  formatCertificateIssuer,
  formatDateAndTime,
  testValidity
} from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;

export const getDetailPrinter = (te: TestEntry): string =>
  `
## Test Zertifikat  
***
**Bescheinigung gültig für ${testValidity(
    te
  )} Stunden ab dem Zeitpunkt der Abholung**
***

Zielkrankheit oder -wirkstoff  
**${te.tg}**  

Testtyp  
**${te.tt.displays[fileLanguage]}**  

Testergebnis  
**${te.tr.displays[fileLanguage]}**  

${te.nm ? `Molekularer Testname  ` : ""}
${te.nm ? `**${te.nm}**  ` : ""}

${
  te.ma && isSome(te.ma)
    ? `Name des Antigentests und Name des Herstellers  `
    : ""
}
${te.ma && isSome(te.ma) ? `**${te.ma.value}**  ` : ""}

Datum und Uhrzeit der Probenentnahme  
**${formatDateAndTime(te.sc, fileLanguage)}**  

${te.dr ? `Datum und Uhrzeit des Testergebnis  ` : ""}
${te.dr ? `**${formatDateAndTime(te.dr, fileLanguage)}**  ` : ""}

Zentrum oder Einrichtung, in der der Test durchgeführt wurde  
**${te.tc}**  

Staat, in dem der Test durchgeführt wurde  
**${te.co}**  

Subjekt, das die Zertifizierung ausgestellt hat  
**${formatCertificateIssuer(te.is, fileLanguage)}**  

Eindeutige Kennung des Zertifikats  
**${te.ci}**  
  
***

*Diese Bescheinigung ist kein Reisedokument.  
Die wissenschaftlichen Erkenntnisse zu COVID-19-Impfung, -Tests und -Wiederherstellung entwickeln sich weiter, auch unter Berücksichtigung der neuen Varianten des Virus.*  
*Bitte informieren Sie sich vor der Reise über die am Zielort geltenden Gesundheitsmaßnahmen und die damit verbundenen Einschränkungen auch auf der Website:*   
[https://reopen.europa.eu/de](https://reopen.europa.eu/de)
  
***
  
Weitere Informationen und den Download des Zertifikats im druckfähigen PDF-Format finden Sie auf der Website  
[www.dgc.gov.it](https://www.dgc.gov.it)
<br/><br/><br/><br/><br/>
`;
