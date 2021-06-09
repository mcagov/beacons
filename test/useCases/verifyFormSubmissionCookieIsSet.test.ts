import { formSubmissionCookieId } from "../../src/lib/types";
import { VerifyFormSubmissionCookieIsSet } from "../../src/useCases/verifyFormSubmissionCookieIsSet";

describe("VerifyFormSubmissionCookieIsSet", () => {
  let context;

  beforeEach(() => {
    context = {
      req: { cookies: {} },
    };
  });

  it("should return true if the form submission cookie is set", () => {
    const useCase = new VerifyFormSubmissionCookieIsSet();
    context.req.cookies[formSubmissionCookieId] = "true";

    const expected = useCase.execute(context);

    expect(expected).toBe(true);
  });

  it("should return false if the form submission cookie is not set", () => {
    const useCase = new VerifyFormSubmissionCookieIsSet();

    const expected = useCase.execute(context);

    expect(expected).toBe(false);
  });

  it("should return false if there are no cookies on the request object", () => {
    const useCase = new VerifyFormSubmissionCookieIsSet();
    context = { req: {} };

    const expected = useCase.execute(context);

    expect(expected).toBe(false);
  });
});
