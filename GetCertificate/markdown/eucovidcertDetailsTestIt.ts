import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isSome } from "fp-ts/lib/Option";
import { TestEntry } from "../certificate";
import { formatCertificateIssuer, formatDateAndTime } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (te: TestEntry): string =>
  `
## Dati Tampone  
***
**Certificazione valida 48 ore dall'ora del prelievo**
***

Malattia o agente bersaglio  
**${te.tg}**  

Tipo di test  
**${te.tt.displays[fileLanguage]}**  

Risultato del test  
**${te.tr.displays[fileLanguage]}**  

${te.nm ? `Nome del test molecolare  ` : ""}
${te.nm ? `**${te.nm}**  ` : ""}

${
  te.ma && isSome(te.ma)
    ? `Nome del test antigenico e nome del produttore  `
    : ""
}
${te.ma && isSome(te.ma) ? `**${te.ma.value}**  ` : ""}

Data e ora del prelievo del campione  
**${formatDateAndTime(te.sc, fileLanguage)}**  

${te.dr ? `Data e ora del risultato del test  ` : ""}
${te.dr ? `**${formatDateAndTime(te.dr, fileLanguage)}**  ` : ""}

Centro o struttura in cui è stato eseguito il test  
**${te.tc}**  

Stato in cui è stato eseguito il test  
**${te.co}**  

Soggetto che ha rilasciato la certificazione  
**${formatCertificateIssuer(te.is, fileLanguage)}**  

Identificativo univoco del certificato  
**${te.ci}**  
  
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
