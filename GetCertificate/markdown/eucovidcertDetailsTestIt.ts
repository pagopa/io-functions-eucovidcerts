import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isSome } from "fp-ts/lib/Option";
import { TestEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (te: TestEntry): string =>
  `
## Dati Tampone  
***
**Certificazione valida 48 ore dall'ora del prelievo**
***

Malattia o agente bersaglio  
**${te.tg.displays.get(fileLanguage)}**  

Tipo di test  
**${te.tt.displays.get(fileLanguage)}**  

Risultato del test  
**${te.tr.displays.get(fileLanguage)}**  

${te.nm ? `Nome del test molecolare  ` : ""}
${te.nm ? `**${te.nm}**  ` : ""}

${
  te.ma && isSome(te.ma)
    ? `Nome del test antigienico e nome del produttore  `
    : ""
}
${
  te.ma && isSome(te.ma)
    ? `**${te.ma.value.displays.get(fileLanguage)}**  `
    : ""
}

Data e ora del prelievo del campione  
**${formatDate(te.sc, fileLanguage)}**  

${te.dr ? `Data e ora del risultato del test  ` : ""}
${te.dr ? `**${formatDate(te.dr, fileLanguage)}**  ` : ""}

Centro o struttura in cui è stato eseguito il test  
**${te.tc}**  

Stato Membro in cui è stato eseguito il test  
**${te.co}**  

Struttura che ha rilasciato la certificazione  
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
`;
