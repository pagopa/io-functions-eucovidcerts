import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { HttpsUrlFromString } from "@pagopa/ts-commons/lib/url";
import { IConfig } from "../config";
import { toSHA256 } from "../conversions";
import { createDGCClientSelector } from "../dgcClientSelector";
import { createClient } from "../../generated/dgc/client";

const httpsAgent = require("../httpsAgent");
const createClientModule = require("../../generated/dgc/client");

const aLoadTestFiscalCode = "AAAAAA00A00A000A" as FiscalCode;
const aUATFiscalCode = "AAAAAA00A00A000B" as FiscalCode;
const aPRODFiscalCode = "AAAAAA00A00A000C" as FiscalCode;

const aLoadTestUrl = "https://example.com/load_test";
const aUATUrl = "https://example.com/uat";
const aPRODUrl = "https://example.com/prod";

const aProdCert = "prod_cert";
const aProdKey = "prod_key";
const aProdCA = "prod_ca";
const aTestCert = "test_cert";
const aTestKey = "test_key";
const aTestCA = "test_ca";
const aUATCert = "uat_cert";
const aUATKey = "uat_key";
const aUATCA = "uat_ca";

const aConfig = ({
  DGC_UAT_CLIENT_CERT: aUATCert,
  DGC_UAT_CLIENT_KEY: aUATKey,
  DGC_UAT_SERVER_CA: aUATCA,
  DGC_LOAD_TEST_CLIENT_CERT: aTestCert,
  DGC_LOAD_TEST_CLIENT_KEY: aTestKey,
  DGC_LOAD_TEST_SERVER_CA: aTestCA,
  DGC_PROD_CLIENT_CERT: aProdCert,
  DGC_PROD_CLIENT_KEY: aProdKey,
  DGC_PROD_SERVER_CA: aProdCA,
  LOAD_TEST_FISCAL_CODES: [aLoadTestFiscalCode],
  DGC_LOAD_TEST_URL: HttpsUrlFromString.decode(aLoadTestUrl).getOrElseL(fail),
  DGC_UAT_FISCAL_CODES: [aUATFiscalCode],
  DGC_UAT_URL: HttpsUrlFromString.decode(aUATUrl).getOrElseL(fail),
  DGC_PROD_URL: HttpsUrlFromString.decode(aPRODUrl).getOrElseL(fail)
} as unknown) as IConfig;
const aProcessEnv: NodeJS.ProcessEnv = {};

const mockGetFetchWithClientCertificate = jest
  .spyOn(httpsAgent, "getFetchWithClientCertificate")
  // We return the configuration instead of a fetch for testing purpose
  .mockImplementation((_, cert, __) => cert);

const mockCreateClient = jest
  .spyOn(createClientModule, "createClient")
  // We return an object with `_kind` prop for testing purpose
  .mockImplementation((params: any) => ({
    _kind: params.fetchApi
  }));

describe("createDGCClientSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a load test client", () => {
    const clientSelector = createDGCClientSelector(aConfig, aProcessEnv);
    const client = clientSelector.select(toSHA256(aLoadTestFiscalCode));
    // We check that all the client are created
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      1,
      aProcessEnv,
      aProdCert,
      aProdKey,
      aProdCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      2,
      aProcessEnv,
      aUATCert,
      aUATKey,
      aUATCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      3,
      aProcessEnv,
      aTestCert,
      aTestKey,
      aTestCA
    );
    expect(mockCreateClient).toBeCalledTimes(3);

    // We check that the returned client from the selector is the expected one
    expect(client).toHaveProperty("_kind", aTestCert);
  });

  it("should return a UAT client", () => {
    const clientSelector = createDGCClientSelector(aConfig, aProcessEnv);
    const client = clientSelector.select(toSHA256(aUATFiscalCode));
    // We check that all the client are created
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      1,
      aProcessEnv,
      aProdCert,
      aProdKey,
      aProdCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      2,
      aProcessEnv,
      aUATCert,
      aUATKey,
      aUATCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      3,
      aProcessEnv,
      aTestCert,
      aTestKey,
      aTestCA
    );
    expect(mockCreateClient).toBeCalledTimes(3);

    // We check that the returned client from the selector is the expected one
    expect(client).toHaveProperty("_kind", aUATCert);
  });

  it("should return a PROD client", () => {
    const clientSelector = createDGCClientSelector(aConfig, aProcessEnv);
    const client = clientSelector.select(toSHA256(aPRODFiscalCode));
    // We check that all the client are created
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      1,
      aProcessEnv,
      aProdCert,
      aProdKey,
      aProdCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      2,
      aProcessEnv,
      aUATCert,
      aUATKey,
      aUATCA
    );
    expect(mockGetFetchWithClientCertificate).nthCalledWith(
      3,
      aProcessEnv,
      aTestCert,
      aTestKey,
      aTestCA
    );
    expect(mockCreateClient).toBeCalledTimes(3);

    // We check that the returned client from the selector is the expected one
    expect(client).toHaveProperty("_kind", aProdCert);
  });
});
