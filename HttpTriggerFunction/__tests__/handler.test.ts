/* tslint:disable: no-any */

import { HttpHandler } from "../handler";

describe("HttpCtrl", () => {
  it("should return a string when the query parameter is provided", async () => {
    const response = await HttpHandler()({} as any, {} as any, "param");
    expect(response.kind).toBe("IResponseSuccessJson");
  });
});
