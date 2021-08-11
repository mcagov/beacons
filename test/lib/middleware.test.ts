import { clearFormSubmissionCookie } from "../../src/lib/middleware";

jest.mock("uuid", () => ({
  v4: () => "1",
}));

jest.mock("urlencoded-body-parser", () =>
  jest.fn(() => Promise.resolve({ model: "ASOS" }))
);

describe("Middleware Functions", () => {
  describe("clearFormSubmissionCookie()", () => {
    let context;

    beforeEach(() => {
      context = {
        res: {
          setHeader: jest.fn(),
        },
        req: { cookies: { formSubmissionCookieId: 1 } },
      };
    });

    const assertCookieCleared = () => {
      clearFormSubmissionCookie(context);

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        "submissionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict"
      );
    };

    it("should clear the form submission cookie if it is set", () => {
      assertCookieCleared();
    });
  });
});
