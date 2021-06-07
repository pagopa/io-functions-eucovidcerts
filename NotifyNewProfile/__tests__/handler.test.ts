import { right } from "fp-ts/lib/Either";
import { Client as IDGCClient } from "../../generated/dgc/client";
import { context } from "../../__mocks__/durable-functions";
import { NotifyNewProfile } from "../handler";

const mockManagePreviousCertificates = jest.fn().mockImplementation(() =>
  Promise.resolve(
    right({
      headers: {},
      status: 200,
      value: {}
    })
  )
);

const mockGetDgcClient = jest.fn().mockImplementation(() => ({
  managePreviousCertificates: mockManagePreviousCertificates
}));

const anInput = "fiscalCode_sha256";

describe("NotifyNewProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should succeded with a valid input", async () => {
    const handler = NotifyNewProfile(mockGetDgcClient);
    const result = await handler(context, anInput);
    expect(mockGetDgcClient).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(result).toEqual("OK");
  });

  it("should fail with an invalid input", async () => {
    const handler = NotifyNewProfile(mockGetDgcClient);
    await expect(handler(context, "")).rejects.toEqual(expect.any(Error));
    expect(mockManagePreviousCertificates).not.toBeCalled();
    expect(context.log.error).toBeCalledTimes(1);
  });

  it("should fail if DGC response status code is not 200", async () => {
    mockManagePreviousCertificates.mockImplementationOnce(() =>
      Promise.resolve(
        right({
          headers: {},
          status: 500,
          value: {}
        })
      )
    );
    const handler = NotifyNewProfile(mockGetDgcClient);
    await expect(handler(context, anInput)).rejects.toEqual(expect.any(Error));
    expect(mockGetDgcClient).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(context.log.error).toBeCalledTimes(1);
  });

  it("should fail if DGC client request fail", async () => {
    mockManagePreviousCertificates.mockImplementationOnce(() =>
      Promise.reject()
    );
    const handler = NotifyNewProfile(mockGetDgcClient);
    await expect(handler(context, anInput)).rejects.toEqual(expect.any(Error));
    expect(mockGetDgcClient).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(context.log.error).toBeCalledTimes(1);
  });
});
