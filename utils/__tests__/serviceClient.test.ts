import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { HttpsUrlFromString } from "@pagopa/ts-commons/lib/url";
import { unknown } from "io-ts";
import { context } from "../../__mocks__/durable-functions";
import { createClient, createPoolSelector } from "../serviceClient";

const aFiscalCodeSet = [
  "PRVPRV25A01H501B", // c58c7c882b44499b1c55a5772eb89aff92e9777583dc28544c9cbaf3aba434f9
  "XXXXXP25A01H501L", // 9fcb63bef1da786514459059aa9c0075114492ed8f66999355b272cfa4aaf195
  "YYYYYP25A01H501K", // 6be7d3fcb61ca4d01b3c4c3d61e7cd7db2d71e67a60912a333e2cb6d29476d77
  "KKKKKP25A01H501U", // 1cace0daf0e87cbf45d683bc3d90d4d9905b2db30d1b4153ffea0f86b7bb0542
  "QQQQQP25A01H501S", // b88d57dc34138eb89d4ec8b8e354b53833c56ac3047febc6143e831c59ee9f2c
  "WWWWWP25A01H501A", // 3aa7e3f27a25681c04bf07e3f74c1e356471264531ec4bd8626f4cd3efde04c5
  "ZZZZZP25A01H501J", // 6414676438ad3279ab4cdb942533e40400247961f54c3c0ca036a231198d51d8
  "JJJJJP25A01H501X", // 6cc2a24e8b8b14a6a08ccd6be6aa02d5b0b7ec82697cfc18d1c493d9d31a968f
  "GGGGGP25A01H501Z" //f079e7dce3e56e6a3d19fc3a2ef9c4473c2644d917ec45bc72cd0a75dfbbdbb0
] as FiscalCode[];

const elem1 = HttpsUrlFromString.decode("https://elem1.com").getOrElseL(_ =>
  fail(`Failed to decode elem1: ${readableReport(_)}`)
);
const elem2 = HttpsUrlFromString.decode("https://elem2.com").getOrElseL(_ =>
  fail(`Failed to decode elem2: ${readableReport(_)}`)
);
const elem3 = HttpsUrlFromString.decode("https://elem3.com").getOrElseL(_ =>
  fail(`Failed to decode elem3: ${readableReport(_)}`)
);

const mockFetch = <T>(status: number, json: T): typeof fetch => {
  return (jest.fn((_1, _2) =>
    Promise.resolve({
      json: () => Promise.resolve(json),
      status
    })
  ) as unknown) as typeof fetch;
};

describe("createPoolSelector", () => {
  it("should select the element in a pool of one", () => {
    const pool = [elem1];
    const selector = createPoolSelector(pool);

    const selected = aFiscalCodeSet.map(selector);

    expect(selected.every(e => e.href === elem1.href)).toBe(true);
  });

  it("should select the same element deterministically", () => {
    const pool = [elem1, elem2, elem3];

    const selector = createPoolSelector(pool);

    const allSelected = aFiscalCodeSet.map(f =>
      // select 100 times the element for each fiscal code,
      //  to be sure it always selects the very same element given the very same fiscal code
      Array.from({ length: 100 }).map(_ => selector(f))
    );

    allSelected.forEach(selected => {
      // check all elements in selected are the same
      expect(new Set(selected).size).toBe(1);
    });
  });

  it("should select different element for different cf", () => {
    const pool = [elem1, elem2, elem3];

    const selector = createPoolSelector(pool);

    const selected = aFiscalCodeSet.map(selector);

    expect(selected.map(e => e.href)).toEqual([
      elem3.href,
      elem2.href,
      elem2.href,
      elem1.href,
      elem2.href,
      elem1.href,
      elem2.href,
      elem2.href,
      elem3.href
    ]);
  });
});

describe("createClient#getLimitedProfileByPost", () => {
  it("should return 403 if the service is not authorized to get the profile", async () => {
    const fetchApi = mockFetch(403, {});
    const client = createClient(
      fetchApi,
      [{ href: "https://localhost" } as any],
      "secret"
    );
    const response = await client
      .getLimitedProfileByPost({} as any, aFiscalCodeSet[0], context)
      .run();
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toHaveProperty(
      "kind",
      "IResponseErrorForbiddenNotAuthorizedForRecipient"
    );
  });

  it("should return 403 if the profile was not found", async () => {
    const fetchApi = mockFetch(404, {});
    const client = createClient(
      fetchApi,
      [{ href: "https://localhost" } as any],
      "secret"
    );
    const response = await client
      .getLimitedProfileByPost({} as any, aFiscalCodeSet[0], context)
      .run();
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toHaveProperty(
      "kind",
      "IResponseErrorForbiddenNotAuthorizedForRecipient"
    );
  });
});
