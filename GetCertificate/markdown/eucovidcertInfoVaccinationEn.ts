import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { some } from "fp-ts/lib/Option";
import { Certificates, ItalianValidityOnlyCertificates } from "../certificate";
import { formatDate, printUvci } from "../printer";

const fileLanguage = PreferredLanguageEnum.en_GB;
const uvci = (c: Certificates): string => printUvci(some(fileLanguage), c);

const printExemptionInfo = `
***
CERTIFICAZIONE VALIDA SOLO IN ITALIA  
sostitutiva, ove previsto dalla normativa vigente, della Certificazione verde COVID-19  
*VALID ONLY IN ITALY*  
*replace the Digital COVID certificate, in accordance with the current national legislation*
***`;

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

${ItalianValidityOnlyCertificates.is(c) ? printExemptionInfo : ""}
<br/><br/><br/><br/><br/>
`;
