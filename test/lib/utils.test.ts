import { GetServerSidePropsContext } from "next";
import {
  ensureFormDataHasKeys,
  handleFormSubmission,
  toArray,
} from "../../src/lib/utils";

// Mock module dependencies in getServerSideProps for testing handleFormSubmission()
jest.mock("../../src/lib/middleware", () => ({
  __esModule: true,
  updateFormCache: jest.fn().mockReturnValue({}),
  withCookieRedirect: jest.fn().mockImplementation((callback) => {
    return async (context) => {
      return callback(context);
    };
  }),
}));
jest.mock("../../src/lib/formValidator", () => ({
  __esModule: true,
  FormValidator: {
    hasErrors: jest.fn().mockReturnValue(false),
  },
}));

describe("toArray()", () => {
  it("should convert a number to an array", () => {
    expect(toArray(1)).toStrictEqual([1]);
  });

  it("should return the array of numbers", () => {
    expect(toArray([1])).toStrictEqual([1]);
  });

  it("should convert a string to an array of a string", () => {
    expect(toArray("beacon")).toStrictEqual(["beacon"]);
  });

  it("should filter out null values in the array", () => {
    expect(toArray(["beacon", null, null, "beacon-2"])).toStrictEqual([
      "beacon",
      "beacon-2",
    ]);
  });

  it("should filter out undefined values in the array", () => {
    expect(toArray(["beacon", void 0, "beacon-2", void 0])).toStrictEqual([
      "beacon",
      "beacon-2",
    ]);
  });
});

describe("ensureFormDataHasKeys()", () => {
  it("should return a new Record with missing keys as blank strings", () => {
    const input = { a: "a", b: "b" };
    const requiredKeys = ["a", "b", "missing"];
    const expectedOutput = { a: "a", b: "b", missing: "" };

    const output = ensureFormDataHasKeys(input, ...requiredKeys);

    expect(output).toEqual(expectedOutput);
  });

  it("should not mutate the input parameter", () => {
    const input = { a: "a", b: "b" };
    const requiredKeys = ["a", "b", "missing"];
    const expectedInput = { a: "a", b: "b" };

    ensureFormDataHasKeys(input, ...requiredKeys);

    expect(input).toEqual(expectedInput);
  });
});

describe("handleFormSubmission()", () => {
  it("should redirect user to given next page on valid form submission", async () => {
    const mockUserSubmittedFormContext = {
      req: {
        method: "POST",
      },
    };
    const nextPagePath = "/page-to-redirect-to-if-form-data-is-valid";
    const response = await handleFormSubmission(nextPagePath)(
      mockUserSubmittedFormContext as GetServerSidePropsContext
    );

    expect(response).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: nextPagePath,
      },
    });
  });

  it("should return a props object when receives a GET request", async () => {
    const mockUserAccessedPageWithGETRequest = {
      req: {
        method: "GET",
      },
    };
    const nextPagePath = "/irrelevant";
    const response = await handleFormSubmission(nextPagePath)(
      mockUserAccessedPageWithGETRequest as GetServerSidePropsContext
    );

    expect(response).toStrictEqual({
      props: {
        formData: {},
        needsValidation: false,
      },
    });
  });
});
