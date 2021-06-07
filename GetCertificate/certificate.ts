/**
 * Certificate parsing utilities
 */
import { PreferredLanguage } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { Either, left } from "fp-ts/lib/Either";

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
 * @param qrcode
 * @returns either the Certificate object or a parsing error message
 */
export const parseQRCode = (
  _qrcode: string
): Either<string, IParsedCertificate> =>
  left(`QRCode parsing not yet implemented`);
