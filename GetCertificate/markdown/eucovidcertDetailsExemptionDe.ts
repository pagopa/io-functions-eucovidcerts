import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
## Digitale Bescheinigung der Befreiung von der Impfung gegen COVID-19  
***  
**NUR IN ITALIEN GÜLTIG**  
***  

Krankheit oder Erreger  
**${ee.tg}**  

Steuernummer des zertifizierenden Arztes  
**${ee.fc}**  
  
Datum des Beginns der Gültigkeit der Bescheinigung  
**${formatDate(ee.df, fileLanguage)}**  

Datum des Gültigkeitsende der Bescheinigung  
**${formatDate(ee.du, fileLanguage)}**  

Eindeutiger Kodex der Impfbefreiung (CUEV)  
**${ee.cu}**  

Subjekt, welches die digitale Befreiungsbescheinigung ausgestellt hat  
**${formatCertificateIssuer(ee.is, fileLanguage)}**  

***  
*Diese Bescheinigung ist nur in Italien gültig und kann als Ersatz des Grünen COVID-19-Zertifikats 
für die Ausübung von Tätigkeiten und die Nutzung der Diensten, 
gemäß den geltenden nationalen Rechtsbestimmungen, verwendet werden.*  
***  
  
Für zusätzliche Informationen und Datenblatt zur Privacy:  
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;
