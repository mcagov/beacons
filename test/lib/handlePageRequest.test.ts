// Mock module dependencies in getServerSideProps for testing handlePageRequest()
import { FormJSON } from "../../src/lib/form/formManager";
import { handlePageRequest } from "../../src/lib/handlePageRequest";

jest.mock("../../src/lib/middleware", () => ({
  __esModule: true,
  parseFormData: jest.fn().mockReturnValue({}),
  updateFormCache: jest.fn(),
  getCache: jest.fn().mockReturnValue({}),
  withCookieRedirect: jest.fn().mockImplementation((callback) => {
    return async (context) => {
      return callback(context);
    };
  }),
}));

describe("handlePageRequest()", () => {
  let getFormGroup;
  let context;

  beforeEach(() => {
    getFormGroup = () => {
      return {
        markAsDirty: jest.fn(),
        hasErrors: jest.fn().mockReturnValue(false),
      };
    };

    context = {
      req: {
        method: "POST",
      },
    };
  });

  it("should redirect user to given next page on valid form submission", async () => {
    const nextPagePath = "/page-to-redirect-to-if-form-data-is-valid";
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(context);

    expect(response).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: nextPagePath,
      },
    });
  });

  it("should return the serialized form data on invalid form submission", async () => {
    const expectedFormJSON: FormJSON = {
      hasErrors: false,
      errorSummary: [],
      fields: { hexId: { value: "1234", errorMessages: [] } },
    };
    getFormGroup = () => {
      return {
        markAsDirty: jest.fn(),
        hasErrors: jest.fn().mockReturnValue(true),
        serialise: jest.fn().mockReturnValue(expectedFormJSON),
      };
    };

    const response = await handlePageRequest("/", getFormGroup)(context);

    expect(response).toStrictEqual({
      props: {
        form: expectedFormJSON,
      },
    });
  });

  it("should return the cached formJSON when it receives a GET request", async () => {
    const expectedFormJSON: FormJSON = {
      hasErrors: false,
      errorSummary: [],
      fields: { hexId: { value: "1234", errorMessages: [] } },
    };
    context.req.method = "GET";
    const nextPagePath = "/irrelevant";
    getFormGroup = () => {
      return {
        serialise: jest.fn().mockReturnValue(expectedFormJSON),
      };
    };
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(context);

    expect(response).toStrictEqual({
      props: {
        form: expectedFormJSON,
      },
    });
  });
});
