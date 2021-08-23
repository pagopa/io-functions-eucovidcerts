import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";
import { Certificates } from "../certificate";
import { formatDate, printUvci } from "../printer";

const fileLanguage = PreferredLanguageEnum.de_DE;
const uvci = (c: Certificates): string => printUvci(some(fileLanguage), c);

export const getInfoPrinter = (c: Certificates): string =>
  `
Surname(s) and forename(s)  
*Nachname und Vorname*  
**${c.nam.fn} ${c.nam.gn}**  

Date of birth  
*Geburtsdatum (JJJJ-MM-TT)*  
**${formatDate(c.dob, fileLanguage)}**  

Unique Certificate Identifier  
*Eindeutige Kennung des Zertifikats*  
**${uvci(c)}**  

[Kopiere die Kennung](iohandledlink://copy:${uvci(c)})
<br/><br/><br/><br/><br/>
`;
