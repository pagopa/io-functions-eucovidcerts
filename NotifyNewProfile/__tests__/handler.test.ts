import { right } from "fp-ts/lib/Either";
import { Client as IDGCClient } from "../../generated/dgc/client";
import { createDGCClientSelector } from "../../utils/dgcClientSelector";
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

const mockSelect = jest.fn().mockImplementation(() => ({
  managePreviousCertificates: mockManagePreviousCertificates
}));

const mockGetDgcClientSelector = {
  select: mockSelect
};

const anInput = "fiscalCode_sha256";

describe("NotifyNewProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should succeded with a valid input", async () => {
    const handler = NotifyNewProfile(mockGetDgcClientSelector);
    const result = await handler(context, anInput);
    expect(mockSelect).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(result).toEqual("OK");
  });

  it("should fail with an invalid input", async () => {
    const handler = NotifyNewProfile(mockGetDgcClientSelector);
    await expect(handler(context, "")).rejects.toEqual(expect.any(Error));
    expect(mockSelect).not.toBeCalled();
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
    const handler = NotifyNewProfile(mockGetDgcClientSelector);
    await expect(handler(context, anInput)).rejects.toEqual(expect.any(Error));
    expect(mockSelect).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(context.log.error).toBeCalledTimes(1);
  });

  it("should fail if DGC client request fail", async () => {
    mockManagePreviousCertificates.mockImplementationOnce(() =>
      Promise.reject()
    );
    const handler = NotifyNewProfile(mockGetDgcClientSelector);
    await expect(handler(context, anInput)).rejects.toEqual(expect.any(Error));
    expect(mockSelect).toBeCalledWith(anInput);
    expect(mockManagePreviousCertificates).toBeCalledWith({
      body: { cfSHA256: anInput }
    });
    expect(context.log.error).toBeCalledTimes(1);
  });
});
