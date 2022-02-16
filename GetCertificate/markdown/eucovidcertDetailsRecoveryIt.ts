import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { CBisCertificateTypeEnrichment, RecoveryEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (
  tr: RecoveryEntry,
  certificateTypeEnrichment?: string
): string =>
  `
## Certificato di Guarigione
***
${
  CBisCertificateTypeEnrichment.is(certificateTypeEnrichment)
    ? `**Certificazione valida in Unione Europea fino alla data di fine validità e valida in Italia dalla data di inizio validità senza necessità di ulteriori dosi di richiamo, salvo modifiche normative. 
    Per esigenze tecniche potrà essere emesso un nuovo QR code dopo 18 mesi (540 giorni) dalla data di inizio validità**`
    : "**Certificazione valida in Unione Europea fino alla data di fine validità e valida in Italia 180 giorni (6 mesi) dalla data di inizio validità**"
}
***

Malattia o agente bersaglio da cui la persona è guarita  
**${tr.tg}**  

Data del primo test molecolare positivo  
**${formatDate(tr.fr, fileLanguage)}**  

Stato in cui è stato eseguito il primo test molecolare positivo  
**${tr.co}**  

Soggetto che ha rilasciato la certificazione  
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
<br/><br/><br/><br/><br/>
`;
