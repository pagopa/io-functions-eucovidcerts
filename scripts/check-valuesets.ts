/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fetch from "node-fetch";
import { Response } from "node-fetch";
import * as te from "fp-ts/lib/TaskEither";
import * as e from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { IReadonlyMap } from "../utils/conversions";
import { diseaseAgentTargeted } from "../GetCertificate/valuesets/diseaseAgentTargeted";
import { labTestManufactorers } from "../GetCertificate/valuesets/labTestManufactorers";
import { testResults } from "../GetCertificate/valuesets/testResults";
import { labTestTypes } from "../GetCertificate/valuesets/labTestTypes";
import { marketingAuthorizationHolder } from "../GetCertificate/valuesets/marketingAuthorizationHolders";
import { vaccineMedicinalProduct } from "../GetCertificate/valuesets/vaccineMedicinalProduct";
import { vaccineProphylaxis } from "../GetCertificate/valuesets/vaccineProphylaxis";

interface IValueSetValues {
  readonly [key: string]: { readonly display: string };
}

const base_url =
  "https://raw.githubusercontent.com/ehn-dcc-development/ehn-dcc-schema/release/1.3.0/valuesets";

const disease_agent_targeted_url = `${base_url}/disease-agent-targeted.json`;
const test_manufactorer = `${base_url}/test-manf.json`;
const test_results = `${base_url}/test-result.json`;
const test_types = `${base_url}/test-type.json`;
const vaccine_manufactorers = `${base_url}/vaccine-mah-manf.json`;
const vaccine_medicinal_product = `${base_url}/vaccine-medicinal-product.json`;
const vaccine_prophylaxis = `${base_url}/vaccine-prophylaxis.json`;

/**
 *
 * @param url the url to call
 * @returns either an Error or a Response
 */
const fetchUrl = (url: string): te.TaskEither<Error, Response> =>
  te.tryCatch(
    () => fetch(url),
    _ => Error(`Error fetching url ${url}`)
  );

/**
 *
 * @param res the response
 * @returns either an Error
 * or an object containing all values decoded from json
 */
const extractValueSetFromJsonBody = (
  res: Response
): te.TaskEither<Error, IValueSetValues> =>
  te
    .tryCatch(
      () => res.json(),
      _ => Error(`Error decoding response body`)
    )
    .map(valuesets => valuesets.valueSetValues as IValueSetValues);

const getValueSetValues = async (url: string): Promise<IValueSetValues> =>
  await pipe(
    url,
    e.right,
    te.fromEither,
    te.mapLeft(_ => Error("Fetching data")),
    te.chain(fetchUrl),
    te.filterOrElse(
      r => r.status === 200,
      _ => Error(`Error calling api ${_.status}`)
    ),
    te.chain(extractValueSetFromJsonBody),
    te.getOrElse(l => {
      throw l;
    })
  ).run();

const checkValues = (
  valuesFromRepo: IValueSetValues,
  valuesFromCode: IReadonlyMap
): boolean => {
  const hasValuesNotListedInRepo = Object.keys(valuesFromCode).some(
    key => !valuesFromRepo[key]
  );
  const missesValuesInRepo = Object.keys(valuesFromRepo).some(
    key => !valuesFromCode[key]
  );

  return hasValuesNotListedInRepo || missesValuesInRepo;
};

const listDifferentValue = (
  valuesFromRepo: IValueSetValues,
  valuesFromCode: IReadonlyMap
): void => {
  console.log(`-----`);
  console.log(`Missing in repo`);
  // eslint-disable-next-line functional/no-let
  let missingKeysInRepo = 0;
  Object.keys(valuesFromCode).forEach(key => {
    if (!valuesFromRepo[key]) {
      missingKeysInRepo++;
      console.log(`${key}`);
    }
  });
  console.log(`--> Total removed from repo: ${missingKeysInRepo}`);

  console.log(`-----`);
  console.log(`Missing in our code`);
  // eslint-disable-next-line functional/no-let
  let missingKeysInCode = 0;
  Object.keys(valuesFromRepo).forEach(key => {
    if (!valuesFromCode[key]) {
      missingKeysInCode++;
      console.log(`"${key}": "${valuesFromRepo[key].display}"`);
    }
  });
  console.log(`--> Total missing in code: ${missingKeysInCode}`);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
void (async () => {
  // Check disease-agent-targeted.json
  const diseaseAgentTargetedFromRepo = await getValueSetValues(
    disease_agent_targeted_url
  );
  if (checkValues(diseaseAgentTargetedFromRepo, diseaseAgentTargeted)) {
    console.error(`Disease agent targeted list has changed`);
  }

  // Check test-manf.json
  const testManufactorerFromrepo = await getValueSetValues(test_manufactorer);
  if (checkValues(testManufactorerFromrepo, labTestManufactorers)) {
    console.error(`lab test manufactorer list has changed`);
    listDifferentValue(testManufactorerFromrepo, labTestManufactorers);
  }

  // Check test-result.json
  const labTestResultFromCode = Object.entries(testResults).reduce(
    (prev, curr) => ({ ...prev, [curr[0]]: curr[1].displays.en_GB }),
    {} as IReadonlyMap
  );
  const labTestResultFromRepo = await getValueSetValues(test_results);
  if (checkValues(labTestResultFromRepo, labTestResultFromCode)) {
    console.error(`lab test result list has changed`);
    listDifferentValue(labTestResultFromRepo, labTestResultFromCode);
  }

  // Check test-type.json
  const labtestTypesFromCode = Object.entries(labTestTypes).reduce(
    (prev, curr) => ({ ...prev, [curr[0]]: curr[1].displays.en_GB }),
    {} as IReadonlyMap
  );
  const labTestTypesFromRepo = await getValueSetValues(test_types);
  if (checkValues(labTestTypesFromRepo, labtestTypesFromCode)) {
    console.error(`lab test types list has changed`);
  }

  // Check vaccine-mah-manf.json
  const vaccinemanufactorerFromRepo = await getValueSetValues(
    vaccine_manufactorers
  );
  if (checkValues(vaccinemanufactorerFromRepo, marketingAuthorizationHolder)) {
    console.error(`vaccine-mah-manf.json has changed`);
  }

  // Check vaccine-medicinal-product.json
  const vaccineMedicalProductsFromRepo = await getValueSetValues(
    vaccine_medicinal_product
  );
  if (checkValues(vaccineMedicalProductsFromRepo, vaccineMedicinalProduct)) {
    console.error(`vaccine-medicinal-product.json has changed`);
  }

  // Check vaccine-prophylaxis.json
  const vaccineProphylaxisFromRepo = await getValueSetValues(
    vaccine_prophylaxis
  );
  if (checkValues(vaccineProphylaxisFromRepo, vaccineProphylaxis)) {
    console.error(`vaccine-prophylaxis.json has changed`);
  }
})();
