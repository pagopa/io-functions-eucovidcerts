/**
 * Certificate parsing utilities
 */
import { PreferredLanguage } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { Either, left } from "fp-ts/lib/Either";

import * as base45 from "base45-js";
import * as zlib from "pako";
import * as borc from "borc";

/**
 * Schema of a Certificate
 */
interface IParsedCertificate {
  readonly id: string;
  // TODO: add all meaningful fields
}

/**
 * Signature of a function that creates a text from a Certificate object
 */
type CertificatePrinter = (e: IParsedCertificate) => string;

/**
 * The default info printer, used to render a markdown text from a certificate for languages we don't have a specific translation
 *
 * @param certificate a Certificate object
 * @returns a markdown print of the Certificate
 */
const defaultPrintInfo: CertificatePrinter = _certificate => ``;

/**
 * The default detail printer, used to render a markdown text from a certificate for languages we don't have a specific translation
 *
 * @param certificate a Certificate object
 * @returns a markdown print of the Certificate
 */
const defaultPrintDetail: CertificatePrinter = _certificate => ``;

/**
 * Collection of printers for every supported language.
 * info is a short text containing the bare set of informations for a Certificate
 * detail is a a text with all meaningful info for the certificate
 */
export const printers: Record<
  PreferredLanguage,
  { readonly info: CertificatePrinter; readonly detail: CertificatePrinter }
> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  de_DE: { detail: defaultPrintDetail, info: defaultPrintInfo },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  en_GB: { detail: defaultPrintDetail, info: defaultPrintInfo },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  es_ES: { detail: defaultPrintDetail, info: defaultPrintInfo },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fr_FR: { detail: defaultPrintDetail, info: defaultPrintInfo },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  it_IT: { detail: defaultPrintDetail, info: defaultPrintInfo }
};

/**
 * Parse a given base64 string representing a qrcode image to extract Certificate's informations
 *
 * @param qrcode base64-encoded png byte payload
 * @returns either the Certificate object or a parsing error message
 */
export const parseQRCode = (
  _qrcode: string
): Either<string, IParsedCertificate> => {
  /* let rawb45 =
  "HC1:NCFOXN%TS3DH3ZSUZK+.V0ETD%65NL-AHNXHIOOW%ID3UQC0GJL/A55I1+QI6M8SA3/-2E%5TR5VVBFVAPUB1VCSWC%PDGZKBTC$JC6VCQVD. CL%2ZXIVVG2Z15ZM866-G9WC5OFU946+967KQZE9%UP3M104AM69 JU/V9355P1MO3Q$W5$25L7E-G9EB9/-11W50NPRN9F698.P-50B5HL4LQ/SLE50$499T8X3JZILDB57ABYIPZA 1JG71RCR5D6SSPW+QIHPZNQJ+Q8+PTGO9+P+*PIHPCNP81RP*OIHP*+RKHPS$RAC5887VJP7FRDEO+LO4%M*XKAL6AHLW 70SO:GOLIROGONP5X457VCE8C09DC8CUCII7JSTNCA799MC$Q3R69 OZDP*DPK+Q92SYW6MIRNCQIW6B95CAM7/2Q+8 CA:CADKL-$V4%D99TJX3DKB:ZJ83BDPSCFTB.SBVTHOJ92KNNSQBJGZIGOJ6NJF0JEYI1DLNCKUCI5OI9YI:8DGCDBZ1MSM%4HQ27ZV0I*0%S7K3ERIQ$IL0P6Y/B0U5L 6S%I4X6*-SU%AAMA$8QO4TD1S:I74$ULPF:1ET7PCDAAUA*.EIXMD8M82GG569MV -CQH1S0DTFJ";
let tstb45 =
  "HC1:NCFOXN%TS3DH3ZSUZK+.V0ETD%65NL-AHNXHIOOW%ID3UQC0GJL/A55I1+QI6M8SA3/-2E%5TR5VVBFVAPUB1VCSWC%PDGZKBTC$JC6VCQVD. CL%2ZXIVVG2Z15ZM866-G9WC5OFU946+967KQZE9%UP3M104AM69 JU/V9355P1MO3Q$W5$25L7E-G9EB9/-11W50NPRN9F698.P-50B5HL4LQ/SLE50$499T8X3JZILDB57ABYIPZA 1JG71RCR5D6SSPW+QIHPZNQJ+Q8+PTGO9+P+*PIHPCNP81RP*OIHP*+RKHPS$RAC5887VJP7FRDEO+LO4%M*XKAL6AHLW 70SO:GOLIROGONP5X457VCE8C09DC8CUCII7JSTNCA799MC$Q3R69 OZDP*DPK+Q92SYW6MIRNCQIW6B95CAM7/2Q+8 CA:CADKL-$V4%D99TJX3DKB:ZJ83BDPSCFTB.SBVTHOJ92KNNSQBJGZIGOJ6NJF0JEYI1DLNCKUCI5OI9YI:8DGCDBZ1MSM%4HQ27ZV0I*0%S7K3ERIQ$IL0P6Y/B0U5L 6S%I4X6*-SU%AAMA$8QO4TD1S:I74$ULPF:1ET7PCDAAUA*.EIXMD8M82GG569MV -CQH1S0DTFJ";
console.log(tstb45 === rawb45); // just make sure that PREFIX value in xx.json is the same as the decoded value from QRcode
let [_, ...b45] = rawb45.split(":");
b45 = b45.join(":");
// decode the Base45 -> you will get COSE data, potentially compressed
let data = base45.decode(b45);
if (data[0] == 0x78) data = zlib.inflate(data);
// if we were a verifier app, we would now check the COSE signature
// since we are not, we just unpack the cose format to get the plaintext
// COSE: protected head - unprotected head - plaintext
let plaintext = borc.decodeFirst(data).value[2];
// do another round of CBOR decoding and you will get a Map, convert to JSON
let json = Object.create(null);
for (let [k, v] of borc.decode(plaintext)) {
  json[k] = v;
}
// or if you don't want to convert, just use the .get(-260) method of Map
console.log(json);
console.log(json[-260]);
 */
  return left(`QRCode parsing not yet implemented`);
};
