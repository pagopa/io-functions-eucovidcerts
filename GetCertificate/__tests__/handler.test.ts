import { Client as DGCClient } from "../../generated/dgc/client";
import { GetCertificateHandler } from "../handler";

import { createDGCClientSelector } from "../../utils/dgcClientSelector";

import { context } from "../../__mocks__/durable-functions";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import * as e from "fp-ts/lib/Either";
import * as t from "io-ts";

const aFiscalCode = "PRVPRV25A01H501B";

describe("GetCertificate", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should log an error if dgc call fails", async () => {
    const client = {
      getCertificateByAutAndCF: (_: any) =>
        Promise.resolve(
          e.left([
            {
              value: _,
              /** where the error originated */
              context: ([] as any) as t.Context,
              /** optional custom error message */
              message: "A test error occurres"
            }
          ] as t.Errors)
        )
    };

    const mockClientSelector: ReturnType<typeof createDGCClientSelector> = {
      select: (hashedFiscalCode): DGCClient => (client as any) as DGCClient
    };
    const val = await GetCertificateHandler(mockClientSelector)(context, {
      fiscal_code: aFiscalCode as FiscalCode,
      auth_code: "anAuthCode"
    });
    console.log(val);
    expect(val).toMatchObject({
      kind: "IResponseErrorInternal"
    });

    expect(context.log.error).toHaveBeenCalledTimes(1);
    expect(context.log.error).toHaveBeenCalledWith(
      "GetCertificateParams|dgcClient.getCertificateByAutAndCF|request failure|IResponseErrorInternal"
    );
  });

  it("should log and error if an unhandled status code han been returned from dgc", async () => {
    const aDGCReturnValue = { status: 418 };

    const client = {
      getCertificateByAutAndCF: (_: any) =>
        Promise.resolve(e.right(aDGCReturnValue))
    };

    const mockClientSelector: ReturnType<typeof createDGCClientSelector> = {
      select: (hashedFiscalCode): DGCClient => (client as any) as DGCClient
    };

    try {
      const val = await GetCertificateHandler(mockClientSelector)(context, {
        fiscal_code: aFiscalCode as FiscalCode,
        auth_code: "anAuthCode"
      });
    } catch (error) {}

    expect(context.log.error).toHaveBeenCalledTimes(1);
    expect(context.log.error).toHaveBeenCalledWith(
      "GetCertificateParams|dgcClient.getCertificateByAutAndCF|unexpected status code|418"
    );
  });

  it("should log and error if qr code process ended with an error", async () => {
    const aDGCReturnValue = { status: 200, value: { data: { qrcodeB64: "" } } };

    const client = {
      getCertificateByAutAndCF: (_: any) =>
        Promise.resolve(e.right(aDGCReturnValue))
    };

    const mockClientSelector: ReturnType<typeof createDGCClientSelector> = {
      select: (hashedFiscalCode): DGCClient => (client as any) as DGCClient
    };

    try {
      const val = await GetCertificateHandler(mockClientSelector)(context, {
        fiscal_code: aFiscalCode as FiscalCode,
        auth_code: "anAuthCode"
      });
    } catch (error) {
      fail(error);
    }

    expect(context.log.error).toHaveBeenCalledTimes(1);
    expect(context.log.error).toHaveBeenCalledWith(
      "GetCertificateParams|parseQRCode|unable to parse QRCode"
    );
  });
});
