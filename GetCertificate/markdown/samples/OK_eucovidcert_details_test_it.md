## Dati Tampone
***
**Certificazione valida [48/72] ore dall'ora del prelievo**
***

Malattia o agente bersaglio  
**<tg>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/disease-agent-targeted.json -->

Tipo di test  
**<tt>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-type.json !!! Anche qui va tradotto "LP217198-3"->"Test antigenico rapido"; "LP6464-4"->"Test molecolare" -->

Risultato del test  
**<tr>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-result.json !!!Occhio che in questo caso il risultato va tradotto in italiano!!! In teoria dovrebbe essere sempre il valore "260415000" che corrisponde al valore "not detected", in italiano "negativo" -->

<!-- if nm!=null && nm!="" -->
Nome del test molecolare  
**<nm>**  

<!-- endif -->
<!-- if ma!=null && ma!="" -->
Nome del test antigienico e nome del produttore  
**<ma>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-manf.json -->

<!-- endif -->
Data e ora del prelievo del campione  
**<sc>**  

<!-- if dr!=null && dr!="" -->
Data e ora del risultato del test (facoltativo per test antigenici rapidi)  
**<dr>**  
<!-- endif -->

Centro o struttura in cui è stato eseguito il test  
**<tc>**  

Stato Membro in cui è stato eseguito il test  
**<co>**  

Struttura che ha rilasciato la certificazione  
**<is>**  

Identificativo univoco del certificato  
**<ci>**  

***

*Questo certificato non è un documento di viaggio. 
Le evidenze scientifiche sulla vaccinazione, sui test e sulla guarigione da COVID-19 continuano ad evolversi, anche in considerazione delle nuove varianti del virus.*  
*Prima di viaggiare, si prega di controllare le misure di salute pubblica applicate nel luogo di destinazione e le relative restrizioni anche consultando il sito:*   
[https://reopen.europa.eu/it](https://reopen.europa.eu/it)
  
***
  
Per ulteriori informazioni e per scaricare il certificato in formato PDF stampabile vai su 
[www.dgc.gov.it](https://www.dgc.gov.it)
