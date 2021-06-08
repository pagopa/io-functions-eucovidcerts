import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { VaccinationEntry } from "../certificate";
import { isVaccinationProcessEnded, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (v: VaccinationEntry): string =>
  `## Certificato di Vaccinazione
***
${
  isVaccinationProcessEnded(v)
    ? "**Certificazione valida 270 giorni (9 mesi) dalla data dell'ultima somministrazione**"
    : "**Certificazione valida fino alla prossima dose**"
}
***

Malattia o agente bersaglio  
**${v.tg.displays.get(fileLanguage)}**

Tipo di vaccino somministrato  
**${v.vp.displays.get(fileLanguage)}**

Denominazione del vaccino  
**${v.mp.displays.get(fileLanguage)}**

Produttore o titolare dell’AIC del vaccino  
**${v.ma.displays.get(fileLanguage)}**

Numero della dose effettuata / numero totale dosi previste  
**${v.dn} / ${v.sd}**

Data dell’ultima somministrazione (yyyy-mm-dd) 
**${formatDate(v.dt, fileLanguage)}**

Stato Membro in cui è stata eseguita la vaccinazione    
**${v.co}**

Struttura che ha rilasciato la certificazione 
**${v.is}**

Identificativo univoco del certificato  
**${v.ci}**
  
***

*Questo certificato non è un documento di viaggio. 
Le evidenze scientifiche sulla vaccinazione, sui test e sulla guarigione da COVID-19 continuano ad evolversi, anche in considerazione delle nuove varianti del virus.*  
*Prima di viaggiare, si prega di controllare le misure di salute pubblica applicate nel luogo di destinazione e le relative restrizioni anche consultando il sito:*   
[https://reopen.europa.eu/it](https://reopen.europa.eu/it)
  
***
  
Per ulteriori informazioni e per scaricare il certificato in formato PDF stampabile vai su 
[www.dgc.gov.it](https://www.dgc.gov.it)`;
