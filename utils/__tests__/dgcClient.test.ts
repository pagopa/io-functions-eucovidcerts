import { FiscalCode, NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { UrlFromString } from "@pagopa/ts-commons/lib/url";
import { IConfig } from "../config";
import { sha256 } from "../conversions";
import { getDGCClientBuilder } from "../dgcClient";
import { DGCEnvironment } from "../httpsAgent";
const httpsAgent = require("../httpsAgent");

const aLoadTestFiscalCode = "AAAAAA00A00A000A" as FiscalCode;
const aUATFiscalCode = "AAAAAA00A00A000B" as FiscalCode;
const aPRODFiscalCode = "AAAAAA00A00A000C" as FiscalCode;

const aLoadTestUrl = "https://example.com/load_test";
const aUATUrl = "https://example.com/uat";
const aPRODUrl = "https://example.com/prod";
const aConfig = ({
  DGC_LOAD_TEST_FISCAL_CODES: [aLoadTestFiscalCode],
  DGC_LOAD_TEST_URL: UrlFromString.decode(aLoadTestUrl).getOrElseL(fail),
  DGC_UAT_FISCAL_CODES: [aUATFiscalCode],
  DGC_UAT_URL: UrlFromString.decode(aUATUrl).getOrElseL(fail),
  DGC_PROD_URL: UrlFromString.decode(aPRODUrl).getOrElseL(fail)
} as unknown) as IConfig;
const aProcessEnv: NodeJS.ProcessEnv = {};

const mockGetFetchWithClientCertificate = jest.spyOn(
  httpsAgent,
  "getFetchWithClientCertificate"
);

describe("getDGCClientBuilder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a load test client", () => {
    const client = getDGCClientBuilder(aConfig, aProcessEnv);
    client(sha256(aLoadTestFiscalCode) as NonEmptyString);
    expect(mockGetFetchWithClientCertificate).toBeCalledWith(
      aProcessEnv,
      DGCEnvironment.LOAD_TEST
    );
  });

  it("should return a UAT client", () => {
    const client = getDGCClientBuilder(aConfig, aProcessEnv);
    client(sha256(aUATFiscalCode) as NonEmptyString);
    expect(mockGetFetchWithClientCertificate).toBeCalledWith(
      aProcessEnv,
      DGCEnvironment.UAT
    );
  });

  it("should return a PROD client", () => {
    const client = getDGCClientBuilder(aConfig, aProcessEnv);
    client(sha256(aPRODFiscalCode) as NonEmptyString);
    expect(mockGetFetchWithClientCertificate).toBeCalledWith(
      aProcessEnv,
      DGCEnvironment.PROD
    );
  });
});
