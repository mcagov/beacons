// Mock module dependencies in getServerSideProps for testing handlePageRequest()
import { handlePageRequest } from "../../src/lib/handlePageRequest";

jest.mock("../../src/lib/middleware", () => ({
  __esModule: true,
  parseFormData: jest.fn().mockReturnValue({}),
  updateFormCache: jest.fn(),
  withCookieRedirect: jest.fn().mockImplementation((callback) => {
    return async (context) => {
      return callback(context);
    };
  }),
  decorateGetServerSidePropsContext: jest.fn().mockImplementation((context) => {
    context.submissionId = "id";
    context.registration = {
      getFlattenedRegistration: () => ({ model: "ASOS" }),
    };
    context.useIndex = 1;

    return context;
  }),
}));

jest.mock("../../src/lib/utils", () => ({
  formatUrlQueryParams: jest
    .fn()
    .mockImplementation((dest) => `${dest}?useIndex=1`),
}));
jest.mock("../../src/gateways/basicAuthGateway");

describe("handlePageRequest()", () => {
  let getFormGroup;
  let context;
  let formJSON;

  beforeEach(() => {
    getFormGroup = () => {
      return {
        markAsDirty: jest.fn(),
        hasErrors: jest.fn().mockReturnValue(false),
      };
    };

    formJSON = {
      hasErrors: false,
      errorSummary: [],
      fields: { hexId: { value: "1234", errorMessages: [] } },
    };

    context = {
      req: {
        method: "POST",
        cookies: {},
      },
      query: {},
    };
  });

  it("should should set the showCookieBanner to false if this is the value on the context object", async () => {
    context.req.method = "GET";
    context.showCookieBanner = false;
    getFormGroup = () => {
      return {
        serialise: jest.fn().mockReturnValue(formJSON),
      };
    };

    const response = await handlePageRequest("/", getFormGroup)(context);

    expect(response).toStrictEqual({
      props: {
        form: formJSON,
        showCookieBanner: false,
        flattenedRegistration: { model: "ASOS" },
      },
    });
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
        destination: `${nextPagePath}?useIndex=1`,
      },
    });
  });

  it("should return the serialized form data on invalid form submission", async () => {
    context.showCookieBanner = true;
    getFormGroup = () => {
      return {
        markAsDirty: jest.fn(),
        hasErrors: jest.fn().mockReturnValue(true),
        serialise: jest.fn().mockReturnValue(formJSON),
      };
    };

    const response = await handlePageRequest("/", getFormGroup)(context);

    expect(response).toStrictEqual({
      props: {
        form: formJSON,
        showCookieBanner: true,
        flattenedRegistration: { model: "ASOS" },
      },
    });
  });

  it("should return the cached formJSON when it receives a GET request", async () => {
    context.req.method = "GET";
    const nextPagePath = "/irrelevant";
    context.showCookieBanner = true;
    getFormGroup = () => {
      return {
        serialise: jest.fn().mockReturnValue(formJSON),
      };
    };
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(context);

    expect(response).toStrictEqual({
      props: {
        form: formJSON,
        showCookieBanner: true,
        flattenedRegistration: { model: "ASOS" },
      },
    });
  });
});
