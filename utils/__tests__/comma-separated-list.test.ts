import { CommaSeparatedListOf } from "../comma-separated-list";
import * as t from "io-ts";
import { isLeft, isRight } from "fp-ts/lib/Either";

describe("CommaSeparatedListOf", () => {
  it("should succede to decode a comma separated list of strings", () => {
    const value = "Lorem,ipsum,dolor,sit, amet, consectetur,adipiscing,elit";
    const expected = [
      "Lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit"
    ];

    const CommaSeparatedListOfStrings = CommaSeparatedListOf(t.string);

    const result = CommaSeparatedListOfStrings.decode(value);

    expect(isRight(result)).toBe(true);
    expect(result.value).toEqual(expected);
  });
});
