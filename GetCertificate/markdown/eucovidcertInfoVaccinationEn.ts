import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { Certificates } from "../certificate";
import { formatDate, printUvci, formatUvci } from "../printer.helpers";

const fileLanguage = PreferredLanguageEnum.en_GB;
const uvci = (c: Certificates): string => printUvci(some(fileLanguage), c);
const twoLinesUvci = (c: Certificates): string => pipe(c, uvci, formatUvci);

export const getInfoPrinter = (c: Certificates): string =>
  `
Surname(s) and forename(s)  
*Cognome e Nome*  
**${c.nam.fn} ${c.nam.gn}**  

Date of birth  
*Data di nascita (aaaa-mm-gg)*  
**${formatDate(c.dob, fileLanguage)}**  

Unique Certifcate Identifier  
*Identificativo univoco del certificato*  
**${twoLinesUvci(c)}**  

[copia l’identificativo](iohandledlink://copy:${uvci(c)})
`;
