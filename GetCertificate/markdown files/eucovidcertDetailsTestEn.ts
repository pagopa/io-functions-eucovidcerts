import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { TestEntry } from "../certificate";
import { formatDate } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;

export const getDetailPrinter = (te: TestEntry): string =>
  `## Test Certificate
***
**Certification valid for 48 hours from the time of collection**
***

Disease or agent targeted
**${te.tg.displays.get(fileLanguage)}**

Type of Test
**${te.tt.displays.get(fileLanguage)}**

${te.nm ? `NAA test name\n**${te.nm}**` : ""}

${te.ma ? `RAT test name and manufacturer\n**${te.ma}**` : ""}

Date and time of the test sample collection  
**${formatDate(te.sc, fileLanguage)}**

${
  te.dr
    ? `Date and time of the test result production\n**${formatDate(
        te.dr,
        fileLanguage
      )}**`
    : ""
}

Result of the test
**${te.tr.displays.get(fileLanguage)}**

Testing centre or facility  
**${te.tc}**

Member State of test
**${te.co}**

Certificate issuer 
**${te.is}**

Unique certificate identifier  
**${te.ci}**
  
***

*This certificate is not a travel document. The scientific evidence on COVID-19 vaccination, testing and recovery continues to evolve, including in consideration of the new variants of the virus.*  
*Before traveling, please check the public health measures applied in the place of destination and the related restrictions also by consulting the website:*   
[https://reopen.europa.eu](https://reopen.europa.eu)
  
***
  
For more information and to download the certificate in printable PDF format go to
[www.dgc.gov.it](https://www.dgc.gov.it)`;
