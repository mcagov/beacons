// Mock module dependencies in getServerSideProps for testing handlePageRequest()
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
        hasErrors: jest.fn(),
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

  it("should return a props object when receives a GET request", async () => {
    context.req.method = "GET";
    const nextPagePath = "/irrelevant";
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(context);

    expect(response).toStrictEqual({
      props: {
        formData: {},
        needsValidation: false,
      },
    });
  });

  xit("should return a props object with errors on invalid form submission", () => {
    // TODO
  });
});
