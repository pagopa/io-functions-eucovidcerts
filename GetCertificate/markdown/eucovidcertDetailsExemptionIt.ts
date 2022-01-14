import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ExemptionEntry } from "../certificate";
import { formatCertificateIssuer, formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.it_IT;

export const getDetailPrinter = (ee: ExemptionEntry): string =>
  `
## Certificato di Esenzione  
***  
**Soggetto esente alla vaccinazione anti SARS-CoV-2**  
***  

Malattia o agente bersaglio  
**${ee.tg}**  

Codice fiscale del medico certificatore  
**TODO**  
 
Data inizio validità della certificazione  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    // formatDate(ee.df, fileLanguage)
  }**  

Data di fine validità della certificazione, ove prevista  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    /* formatDate(ee.du, fileLanguage) */
  }**  

Codice univoco esenzione vaccinale (CUEV)  
**TODO**  

Soggetto che ha rilasciato la certificazione digitale di esenzione  
**${
    "TODO"
    // eslint-disable-next-line extra-rules/no-commented-out-code
    // formatCertificateIssuer(tr.is, fileLanguage)
  }**  

***  
*Questa certificazione è valida solo in Italia e può essere utilizzata in sostituzione della Certificazione verde COVID-19 
per lo svolgimento di attività e la fruizione di servizi secondo quanto previsto dalla normativa nazionale vigente*
***  
  
Per ulteriori informazioni e ed informativa privacy: 
[www.dgc.gov.it](https://www.dgc.gov.it); 
[www.salute.gov.it](https://www.salute.gov.it)
<br/><br/><br/><br/><br/>
`;
