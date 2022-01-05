import { Client as DGCClient } from "../../generated/dgc/client";
import { GetCertificateHandler } from "../handler";

import { createDGCClientSelector } from "../../utils/dgcClientSelector";

import { context } from "../../__mocks__/durable-functions";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import * as e from "fp-ts/lib/Either";
import * as t from "io-ts";

import {
  aConfig,
  aLoadTestFiscalCode,
  aProcessEnv
} from "../../__mocks__/clientSelectorConfig";
import { fakeQRCodeInfo } from "../../utils/fakeDGCClient";
import { StatusEnum } from "../../generated/definitions/ValidCertificate";
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { string } from "fp-ts";

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

    expect(context.log.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "GetCertificateParams|parseQRCode|unable to parse QRCode"
      )
    );
  });

  it("should return a fake certificate in case of test users", async () => {
    try {
      const val = await GetCertificateHandler(
        createDGCClientSelector(aConfig, aProcessEnv)
      )(context, {
        fiscal_code: aLoadTestFiscalCode,
        auth_code: "anAuthCode"
      });

      expect(val.kind).toEqual("IResponseSuccessJson");
      if (val.kind === "IResponseSuccessJson") {
        expect(val.value.status).toEqual(StatusEnum.valid);
        if (val.value.status === StatusEnum.valid) {
          expect(val.value.qr_code.content).toEqual(
            fakeQRCodeInfo.data!.qrcodeB64
          );
          expect(val.value.uvci).toEqual(fakeQRCodeInfo.data!.uvci);
          expect(val.value.info).toBeDefined();
          expect(val.value.info!.length).toBeGreaterThan(0);
          expect(val.value.detail).toBeDefined();
          expect(val.value.detail!.length).toBeGreaterThan(0);
        }
      }
    } catch (error) {
      fail(error);
    }
  });

  it.each`
    scenario                     | preferred_languages
    ${"italian language"}        | ${[PreferredLanguageEnum.it_IT]}
    ${"english language"}        | ${[PreferredLanguageEnum.en_GB]}
    ${"german language"}         | ${[PreferredLanguageEnum.de_DE]}
    ${"unhandled language"}      | ${[PreferredLanguageEnum.fr_FR]}
    ${"no language"}             | ${[]}
    ${"no language (undefined)"} | ${undefined}
  `(
    "GIVEN an expired certificate request with $scenario WHEN the getCertificate is invoked THEN the getCertificate return an expired certificate",
    async ({ preferred_languages }) => {
      const aDGCReturnValue = { status: 404 };

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
          auth_code: "anAuthCode",
          preferred_languages
        });

        expect(val).toMatchObject({
          kind: "IResponseSuccessJson",
          value: { info: expect.any(String), status: "expired" }
        });
        // we send something as info
        const info: string = (val as any).value?.info || "";
        expect(info.length).toBeGreaterThan(0);
      } catch (error) {
        fail(error);
      }
    }
  );
});
