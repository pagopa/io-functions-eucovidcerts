import {
  VacCertificate,
  RecoveryCertificate,
  TestCertificate
} from "../certificate";
import {
  decodeCertificateAndLogMissingValues,
  withTrace,
  parseQRCode,
  parseQRCodeAlt
} from "../parser";
import { aValidAntigenTestCertificate } from "../../__mocks__/certificates";
import { isRight } from "fp-ts/lib/Either";

describe.each`
  title                     | parser
  ${"using parseQRCode"}    | ${parseQRCode}
  ${"using parseQRCodeAlt"} | ${parseQRCodeAlt}
`("qr parsers tests $title", ({ parser }) => {
  it("should return a valid Vaccination cartificate", async () => {
    const rawb64png =
      "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";
    const vacc = parser(rawb64png);
    expect(vacc).toMatchSnapshot();
    expect(VacCertificate.is(vacc.value)).toBe(true);
  });

  it("should return a valid Recovery certificate", async () => {
    const rawb64png =
      "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAAGwElEQVR42u2aMa6DTBKEGxGQwQWQuAbZXAlfwJgLwJXIuAYSF4CMANH/V7yVHm+1K/0Bk9kisHFZGvd0V1X3YP5vXqt9YV/YF/aF/T/YatZOVbenZ6jcj2RaNk97W/ps8dGSOLDNj5fPuS2f2rn/zuY8pL6XFuZk4ts4sLF87XMy+hl82MsmlO1Yvuulc3tN9ooGe9dHO/HfwS+npZ/a3uafrIwLy5YzmF7Z0ep2NezLti8eD+YHa8uNvShbP/Is7bw66znZ0+HvZj0II99eU/m/r79p+SBMr937Wrl9GjkwJ1597EgIyH8V4HMwvmrHdHD/WHWGw7L0Y2kf0m5XfIo4MJ8AlJYtn8wa826fX8R/PxLX8rY4sNXmvLZiPIrdLJhq2VkeH1OfKo8EC1BWaTa/pmqbWE+Zh6pTdZcitFgwPi5kdR6oJism3VHwR6is2uLA3BeWxNqIwIeKDsfbZqtJubIYfYgDO8MMUQw+N7X3JFuo+mwu3JpMkfE4sLVePsEvkoS+uNK1LpO96kM1jFbEgfmIEEBTBIQlwZBLH7jKRHoh8owBW20hz99ZWezKrm1MfZQKOylnZRIJVhtryDNWmJ61tWPlU5mz79BXvQxxYNTsRVNXNWUs8sjrag3km6vQ4sCopgSamvjvc+tiqo3g79qCJqRbHBivHhWYKCiTtTAcFEStH961/lnYNqKAECbbXVpNZZU4q4Tdd8qqGuLA1ro6sYjheI3VJyxrPbciZ4yNuNrjwPzahQIMwmeiZak/HiPjzW0XHoVtY6Xdd+6Q7ZKJztPVMHUQ2q8uPAtbMYcqZMQIS+zw1SZVglu8m37X9ixs80p+JhCEdJusBe+oA+SpRUaCuW4u0juZGYJfNmYNhllh+Q3IszD8v0PO4/HaxY1U2QvCJBkm8DfH9SzMyDe0D2WHNJZuhLVkzpEJFhkJRibDjTRW7VS+w2wZ7yGuZc0WrTMO7LSjwfajgwTBiQwhIviH1WDSLg7MR9KMypX2dSNmlVSHQOZ3EHkWcWAbVKk+jkWSbMflGOVU1RHsN4p+FOYyMJbXap+HEfkjCHMTZJXNbk3Ko7AVqcVjqGWm+yiluTVhkf5iabpIsLBIDkzWtKm5EKClr+fm+rlHgtX0UxUdNDHPcY8yGOKrzRf4JIkDQ+ZOXHGm7mOAvgKZxoX+QmXHKw5shRh3BNfeGdmuok5+tJ6Ez25i9Chsu3bfjB6EgsIoooOS+BOvfjOND8PGg13GXazZ8Q5QJcHxYYIqZ7nWOLCraeVblmfQF8Kk9UgH6X2qIQ7szCAoe4swDyXeVBaTnEanfPNIMPzbsNMCaOj0udw4ZfXa1Xxt472ynoTRcTSZpIcSu+zN1cBOPoxlnv32zk/DlmFahh2uhkmgrLSnn5VxPd7Z3MaBXcouGbKLuyjqj/zqQSerj3Fg9Flr0KyguxKP1iNxYGmfSXaHODA2nf8uvdNEevmwTgzqhOj/eMgoMAl90IwLT96S55OmeRRak5Hnv93H0zCqGBrRBAZL86mp6x8RlNl4xYGt5JtYq+o18DnUvVJroybD3X4UkWCZmg6CT7ZjNk6DsjBv+Bkc7J8m5UEY/u0jA1MW1+ECAoE85VBKMI0u48DWzN5BRjGXAqIIaiSdJNe0/8Zvj8IIQrdrYonwaR5SU93Ql4hlzXyLA0MBLyFIL/dY5iFl09UXqKFeujgwFAfeyI3IKLtWtbF0Wyzyz2jiWdjP5KfY4clFwxBNuhSQbYe7bhzyKOy0VLpzdVg9JEa/jIGUwViG29T9YdjVLOdaxqLp1qSwQKEW/o6FH4URakkDvflOA4L20QFBleXlye9W6knY5nKqazga01lDcs0wscerjiB9iAPT6eoozybzr6mLzlBI+1bHHDeD8SystmJXp2zZ0VxnRj1XjUxoIJ9Egplm+wlecadTTqX7U4oimG7eCvBZGGxcaypLZbH75Fsr6f+PAhZxYNg2pAHnlut0VQ4ZTfTRCo3B50iw01jM1XpkqfJtQhSwqSbLcTtfeBimxvkqZ5gqHDrduLYGkcrvxPUsTNMzChlfCm3Sqh9m6Vrj4mSVPQ7sMjY/I0r1sJAV7y+bypuyjQPTMxjy/OgCYBJMDySIu6CyPwejT8L0DIYGlfJOUAelzZu3pdeB0S3Jn4XpyQRZNSWAjjgXHUHijaVHt6dNnoY1ARWw14i+w13q74Yfq+PlKx4s815HcvgZdn/WUZGSbW7qxSPBXOtZ7XgHnfDqOMO8GzVUlB7FgRH86wGeahv1nAmU1V5+tdN1mxI8Cvs+FfaFfWFfWGTYP5ybuiDU/JA2AAAAAElFTkSuQmCC";
    const rec = parser(rawb64png);
    expect(rec).toMatchSnapshot();
    expect(RecoveryCertificate.is(rec.value)).toBe(true);
  });

  it("should return a valid Test certificate", async () => {
    const rawb64png =
      "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";
    const test = parser(rawb64png);
    expect(test).toMatchSnapshot();
    expect(TestCertificate.is(test.value)).toBe(true);
  });

  it("should return a string for a not valid Test certificate", async () => {
    const rawb64png =
      "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";
    const test = parser(rawb64png);
    expect(test.value).toEqual({
      qrcode: rawb64png,
      reason: expect.any(String)
    });
  });
});

describe("decodeCertificateAndLogMissingValues", () => {
  const logWarningMock: (
    warn: string
  ) => void = jest.fn().mockImplementation(_ => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log no warning if certificate has all values", async () => {
    const decodedValue = decodeCertificateAndLogMissingValues(logWarningMock)(
      aValidAntigenTestCertificate
    );

    expect(isRight(decodedValue)).toBe(true);
    expect(TestCertificate.is(decodedValue.value)).toBe(true);
    expect(logWarningMock).not.toHaveBeenCalled();
  });

  it("should log a warning if certificate has at least one value not present in maps", async () => {
    const decodedValue = decodeCertificateAndLogMissingValues(logWarningMock)({
      ...aValidAntigenTestCertificate,
      t: [
        {
          ...aValidAntigenTestCertificate.t[0],
          tg: "INVALID"
        }
      ]
    });

    expect(isRight(decodedValue)).toBe(true);
    expect(TestCertificate.is(decodedValue.value)).toBe(true);
    expect(logWarningMock).toHaveBeenCalledWith(
      'Missing map values|t[0].tg "INVALID" value not found'
    );
  });

  it("should return an error if decode fails", async () => {
    const errorOrDecodedValue = withTrace(
      decodeCertificateAndLogMissingValues(logWarningMock),
      "ErrorMsg"
    )({
      ...aValidAntigenTestCertificate,
      dob: ""
    });

    expect(isRight(errorOrDecodedValue)).toBe(false);
    expect(errorOrDecodedValue.value).toBeInstanceOf(Error);
  });
});
