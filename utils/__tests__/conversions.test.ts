import {
  ITranslatable,
  toTWithMap,
  IReadonlyTranslatableMap,
  toTWithMapOptional,
  IReadonlyMap
} from "../conversions";
import { PreferredLanguageEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { isRight } from "fp-ts/lib/Either";
import * as o from "fp-ts/lib/Option";

// A ReadonlyTranslatableMap map
const translatableMap: IReadonlyTranslatableMap = {
  placeholder: {
    displays: {
      [PreferredLanguageEnum.it_IT]: "---",
      [PreferredLanguageEnum.en_GB]: "---",
      [PreferredLanguageEnum.de_DE]: "---"
    }
  },
  "0001": {
    displays: {
      [PreferredLanguageEnum.it_IT]: "test display in it",
      [PreferredLanguageEnum.en_GB]: "test display in en",
      [PreferredLanguageEnum.de_DE]: "test display in de"
    }
  }
};

// A ReadonlyMap map
const readonlyMap: IReadonlyMap = {
  placeholder: "---",
  "0001": "simple test display in it"
};
describe("toTWithMap", () => {
  const tranlatableMapCodec = toTWithMap(translatableMap);
  const tranlatableMapCodec_placeholder = toTWithMap(
    translatableMap,
    "placeholder"
  );

  // IReadonlyTranslatable
  it("should decode value if key exists in map", () => {
    const res = tranlatableMapCodec.decode("0001");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(translatableMap["0001"]);
  });

  it("should return left if key does not exit in map", () => {
    const res = tranlatableMapCodec.decode("0002");

    expect(isRight(res)).toBe(false);
  });

  it("should return a placeholder if key does not exit in map and placehodler is defined", () => {
    const res = tranlatableMapCodec_placeholder.decode("0002");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(translatableMap.placeholder);
  });

  it("should check is", () => {
    expect(tranlatableMapCodec.is(translatableMap["0001"])).toBe(true);
    expect(tranlatableMapCodec.is(translatableMap["0002"])).toBe(false);
  });

  it("should encode", () => {
    expect(tranlatableMapCodec.encode(translatableMap["0001"])).toEqual("0001");
  });
});

//IReadonlyMap
describe("toTWithMap - Simple map", () => {
  const mapCodec = toTWithMap(readonlyMap);
  it("should decode value if key exists in map", () => {
    const res = mapCodec.decode("0001");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(readonlyMap["0001"]);
  });

  it("should return left if key does not exit in map", () => {
    const res = mapCodec.decode("0002");

    expect(isRight(res)).toBe(false);
  });

  it("should check is", () => {
    expect(mapCodec.is(readonlyMap["0001"])).toBe(true);
    expect(mapCodec.is(readonlyMap["0002"])).toBe(false);
  });

  it("should encode", () => {
    expect(mapCodec.encode(readonlyMap["0001"])).toEqual("0001");
  });
});

describe("toTWithMapOptional", () => {
  const optionalMapCodec = toTWithMapOptional(translatableMap);
  const optionalMapCodec_placeholder = toTWithMapOptional(
    translatableMap,
    "placeholder"
  );

  it("should decode value if key exists in map", () => {
    const res = optionalMapCodec.decode("0001");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(o.some(translatableMap["0001"]));
  });

  it("should decode undefined value", () => {
    const res = optionalMapCodec.decode((undefined as any) as string);

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(o.none);
  });

  it("should return a placeholder if key does not exit in map and placehodler is defined", () => {
    const res = optionalMapCodec_placeholder.decode("0002");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(o.some(translatableMap.placeholder));
  });

  it("should decode empty string value", () => {
    const res = optionalMapCodec.decode("");

    expect(isRight(res)).toBe(true);
    expect((res as any).right).toEqual(o.none);
  });

  it("should fail if value is not present in map", () => {
    const res = optionalMapCodec.decode("0002");

    expect(isRight(res)).toBe(false);
  });

  it("should check is", () => {
    //Check is
    expect(optionalMapCodec.is(o.some(translatableMap["0001"]))).toBe(true);
    expect(optionalMapCodec.is(o.none)).toBe(true);
  });

  it("should encode", () => {
    expect(optionalMapCodec.encode(o.some(translatableMap["0001"]))).toEqual(
      "0001"
    );
  });
});
