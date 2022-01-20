import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
## Certificazione digitale di esenzione dalla vaccinazione anti-COVID-19  
***  
**VALIDA SOLO IN ITALIA**  
***  

Malattia o agente bersaglio  
**${ee.tg}**  

Codice fiscale del medico certificatore  
**${ee.fc}**  
 
Data inizio validità della certificazione  
**${formatDate(ee.df, fileLanguage)}**  

Data di fine validità della certificazione  
**${formatDate(ee.du, fileLanguage)}**  

Codice univoco esenzione vaccinale (CUEV)  
**${ee.cu}**  

Soggetto che ha rilasciato la certificazione digitale di esenzione  
**${formatCertificateIssuer(ee.is, fileLanguage)}**  

***  
*Questa certificazione è valida solo in Italia e può essere utilizzata in sostituzione della Certificazione verde COVID-19 
per lo svolgimento di attività e la fruizione di servizi secondo quanto previsto dalla normativa nazionale vigente*  
***  
  
Per ulteriori informazioni ed informativa privacy: 
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;
