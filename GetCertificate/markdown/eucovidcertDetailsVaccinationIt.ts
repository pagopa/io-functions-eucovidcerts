import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { VaccinationEntry } from "../certificate";
import {
  isVaccinationProcessEnded,
  formatDate,
  formatCertificateIssuer
} from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (v: VaccinationEntry): string =>
  `
## Dati Vaccino  
***
${
  isVaccinationProcessEnded(v)
    ? "**Certificazione valida 180 giorni (6 mesi) dalla data dell’ultima somministrazione, salvo modifiche normative**"
    : "**Certificazione valida dal 15° giorno dalla data di somministrazione e fino al tempo massimo previsto per la dose successiva**"
}
***

Malattia o agente bersaglio  
**${v.tg}**  

Tipo di vaccino somministrato  
**${v.vp}**  

Denominazione del vaccino  
**${v.mp}**  

Produttore o titolare dell’AIC del vaccino  
**${v.ma}**  

Numero della dose effettuata / numero totale dosi previste  
**${v.dn} / ${v.sd}**  

Data dell’ultima somministrazione  
**${formatDate(v.dt, fileLanguage)}**  

Stato in cui è stata eseguita la vaccinazione  
**${v.co}**  

Soggetto che ha rilasciato la certificazione  
**${formatCertificateIssuer(v.is, fileLanguage)}**  

Identificativo univoco del certificato  
**${v.ci}**  
  
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
