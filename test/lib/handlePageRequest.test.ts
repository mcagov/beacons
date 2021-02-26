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

jest.mock("../../src/lib/formValidator", () => ({
  __esModule: true,
  FormValidator: {
    hasErrors: jest.fn().mockReturnValue(false),
  },
}));

describe("handlePageRequest()", () => {
  it("should redirect user to given next page on valid form submission", async () => {
    const mockUserSubmittedFormContext = {
      req: {
        method: "POST",
        cookies: {},
      },
    };
    const nextPagePath = "/page-to-redirect-to-if-form-data-is-valid";
    const response = await handlePageRequest(nextPagePath)(
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
        cookies: {},
      },
    } as GetServerSidePropsContext;
    const nextPagePath = "/irrelevant";
    const response = await handlePageRequest(nextPagePath)(
      mockUserAccessedPageWithGETRequest as GetServerSidePropsContext
    );

    expect(response).toStrictEqual({
      props: {
        formData: {},
        needsValidation: false,
        showCookieBanner: true,
      },
    });
  });

  xit("should return a props object with errors on invalid form submission", () => {
    // TODO
  });
});
