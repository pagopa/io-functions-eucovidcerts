import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { VaccinationEntry } from "../certificate";
import {
  isBooster,
  isVaccinationProcessEnded,
  formatDate,
  formatCertificateIssuer
} from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;

export const getDetailPrinter = (v: VaccinationEntry): string =>
  `
## Impfstoffdaten  
***
${
  isBooster(v)
    ? `**Zertifizierung gültig ab dem Datum der letzten Verabreichung, ohne dass weitere Auffrischungsdosen erforderlich sind, vorbehaltlich regulatorischer Änderungen.
    Aus technischen Gründen kann nach 18 Monaten (540 Tagen) ab Gültigkeitsdatum ein neuer QR-Code ausgestellt werden**`
    : isVaccinationProcessEnded(v)
    ? "**Mit Ausnahme von Änderungen in den Rechtsvorschriften ist der Green Pass 180 Tage (6 Monate) ab dem Datum der letzten Impfung gültig**"
    : "**Der Green Pass gilt ab dem 15. Tag nach dem Verabreichungsdatum der Impfung bis zum maximal möglichen Termin der nächsten Dosis**"
}
***

Zielkrankheit oder -wirkstoff  
**${v.tg}**  

Art des verabreichten Impfstoffs  
**${v.vp}**  

Impfstoffname  
**${v.mp}**  

Impfstoffhersteller oder MAH  
**${v.ma}**  

Anzahl der abgegebenen Dosis / Gesamtzahl der geplanten Dosen  
**${v.dn} / ${v.sd}**  

Datum der letzten Verabreichung  
**${formatDate(v.dt, fileLanguage)}**  

Staat, in dem die Impfung durchgeführt wurde  
**${v.co}**  

Subjekt, das die Zertifizierung ausgestellt hat  
**${formatCertificateIssuer(v.is, fileLanguage)}**  

Eindeutige Kennung des Zertifikats  
**${v.ci}**  
  
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
