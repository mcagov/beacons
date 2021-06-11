import { formSubmissionCookieId } from "../../src/lib/types";
import { verifyFormSubmissionCookieIsSet } from "../../src/useCases/verifyFormSubmissionCookieIsSet";

describe("VerifyFormSubmissionCookieIsSet", () => {
  it("should return true if the form submission cookie is set", () => {
    const context = {
      req: {
        cookies: { [formSubmissionCookieId]: "user-form-submission-uuid" },
      },
    };

    const expected = verifyFormSubmissionCookieIsSet(context as any);

    expect(expected).toBe(true);
  });

  it("should return false if the form submission cookie is not set", () => {
    const context = {
      req: {
        cookies: {},
      },
    };
    const expected = verifyFormSubmissionCookieIsSet(context as any);

    expect(expected).toBe(false);
  });

  it("should return false if there are no cookies on the request object", () => {
    const context = {
      req: {},
    };

    const expected = verifyFormSubmissionCookieIsSet(context as any);

    expect(expected).toBe(false);
  });
});
