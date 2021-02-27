// Mock module dependencies in getServerSideProps for testing handlePageRequest()
import { GetServerSidePropsContext } from "next";
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

  beforeEach(() => {
    getFormGroup = () => {
      return {
        markAsDirty: jest.fn(),
        hasErrors: jest.fn(),
      };
    };
  });

  it("should redirect user to given next page on valid form submission", async () => {
    const mockUserSubmittedFormContext = {
      req: {
        method: "POST",
      },
    };
    const nextPagePath = "/page-to-redirect-to-if-form-data-is-valid";
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(mockUserSubmittedFormContext as GetServerSidePropsContext);

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
    const response = await handlePageRequest(
      nextPagePath,
      getFormGroup
    )(mockUserAccessedPageWithGETRequest as GetServerSidePropsContext);

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
