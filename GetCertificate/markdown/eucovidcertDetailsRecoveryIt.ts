import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { RecoveryEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (tr: RecoveryEntry): string =>
  `
## Certificato di Guarigione

Malattia o agente bersaglio da cui la persona è guarita  
**${tr.tg}**  

Data del primo test molecolare positivo  
**${formatDate(tr.fr, fileLanguage)}**  

Stato Membro in cui è stato eseguito il primo test molecolare positivo  
**${tr.co}**  

Struttura che ha rilasciato la certificazione  
**${formatCertificateIssuer(tr.is, fileLanguage)}**  
 
Certificazione valida dal  
**${formatDate(tr.df, fileLanguage)}**  

Certificazione valida fino al  
**${formatDate(tr.du, fileLanguage)}**  

***

*Questo certificato non è un documento di viaggio.  
Le evidenze scientifiche sulla vaccinazione, sui test e sulla guarigione da COVID-19 continuano ad evolversi, anche in considerazione delle nuove varianti del virus.*  
*Prima di viaggiare, si prega di controllare le misure di salute pubblica applicate nel luogo di destinazione e le relative restrizioni anche consultando il sito:*   
[https://reopen.europa.eu/it](https://reopen.europa.eu/it)
  
***
  
Per ulteriori informazioni e per scaricare il certificato in formato PDF stampabile vai su 
[www.dgc.gov.it](https://www.dgc.gov.it)
`;
