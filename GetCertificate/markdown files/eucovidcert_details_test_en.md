<!-- Based on https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/DGC.Types.schema.json -->

## Test Certificate
***
**Certification valid for 48 hours from the time of collection**
***

Disease or agent targeted  
**<tg>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/disease-agent-targeted.json -->

Type of Test  
**<tt>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-type.json -->

<!-- if nm!=null && nm!="" -->
NAA test name  
**<nm>**  

<!-- endif -->
<!-- if ma!=null && ma!="" -->
RAT test name and manufacturer  
**<ma>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-manf.json -->

<!-- endif -->
Date and time of the test sample collection  
**<sc>** 

<!-- if dr!=null && dr!="" -->
Date and time of the test result production  
**<dr>**  
<!-- endif -->

Result of the test  
**<dr>**  <!-- https://github.com/eu-digital-green-certificates/ehn-dgc-schema/blob/main/valuesets/test-result.json !!!Occhio che in questo caso il risultato va tradotto in italiano!!! In teoria dovrebbe essere sempre il valore "260415000" che corrisponde al valore "not detected", in itasliano "negativo" -->

Testing centre or facility  
**<tc>**

Member State of test  
**<co>**

Certificate issuer  
**<is>**

Unique certificate identifier  
**<ci>**
  
***

*This certificate is not a travel document. The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)
