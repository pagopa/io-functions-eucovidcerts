import { Client as DGCClient } from "../generated/dgc/client";
import { IConfig } from "./config";
import { toHash } from "./hash";

/**
 * Defines a selector object of a type T.
 * A selector returns different implementations of T depending on the value of the fiscal code provided
 */
interface ISelector<T> {
  readonly select: (hashedFiscalCode: string) => T;
}

/**
 * Build a selector object for DGC http client
 *
 * @param param0
 * @returns
 */
export const createDGCClientSelector = ({
  TEST_FISCAL_CODES_UAT,
  TEST_FISCAL_CODES_LOAD
}: IConfig): ISelector<DGCClient> => {
  // calculate hashes in advance
  const hashedTestDGC = TEST_FISCAL_CODES_UAT.map(toHash);
  const hashedTestLoad = TEST_FISCAL_CODES_LOAD.map(toHash);

  // TODO: use real client
  const prodClient = {} as DGCClient;
  const uatClient = {} as DGCClient;
  const loadClient = {} as DGCClient;

  return {
    select: (hashedFiscalCode): DGCClient =>
      hashedTestDGC.includes(hashedFiscalCode)
        ? uatClient
        : hashedTestLoad.includes(hashedFiscalCode)
        ? loadClient
        : prodClient
  };
};
