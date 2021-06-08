import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { createPoolSelector } from "../serviceClient";

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

describe("createPoolSelector", () => {
  it("should select the element in a pool on one", () => {
    const pool = ["elem1"];
    const selector = createPoolSelector(pool);

    const selected = aFiscalCodeSet.map(selector);

    expect(selected.every(e => e === "elem1")).toBe(true);
  });

  it("should select the same element deterministically", () => {
    const pool = ["elem1", "elem2", "elem3"];

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
    const pool = ["elem1", "elem2", "elem3"];

    const selector = createPoolSelector(pool);

    const selected = aFiscalCodeSet.map(selector);

    expect(selected).toEqual([
      "elem3",
      "elem2",
      "elem2",
      "elem1",
      "elem2",
      "elem1",
      "elem2",
      "elem2",
      "elem3"
    ]);
  });
});
