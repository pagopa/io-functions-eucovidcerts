import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";
import { Certificates } from "../certificate";
import { formatDate, printUvci } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;
const uvci = (c: Certificates): string => printUvci(some(fileLanguage), c);

export const getInfoPrinter = (c: Certificates): string =>
  `
Surname(s) and forename(s)  
*Cognome e Nome*  
**${c.nam.fn} ${c.nam.gn}**  

Date of birth  
*Data di nascita (aaaa-mm-gg)*  
**${formatDate(c.dob, fileLanguage)}**  

Unique Certificate Identifier  
*Identificativo univoco del certificato*  
**${uvci(c)}**  

[copia l’identificativo](iohandledlink://copy:${uvci(c)})
<br/><br/><br/><br/><br/>
`;
