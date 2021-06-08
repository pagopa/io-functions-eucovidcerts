import { VaccinationEntry } from "../certificate";
import { isVaccinationProcessEnded } from "../printer";

export const getInfoPrinter = (v: VaccinationEntry): string =>
  `***
${
  isVaccinationProcessEnded(v)
    ? "**Certification valid for 270 days (9 months) from the date of the last administration**"
    : "**Certification valid until next dose**"
}
***
`;
