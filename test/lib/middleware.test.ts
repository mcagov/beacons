import {
  clearFormSubmissionCookie,
  setFormSubmissionCookie,
} from "../../src/lib/middleware";
import { formSubmissionCookieId as submissionCookieId } from "../../src/lib/types";

jest.mock("uuid", () => ({
  v4: () => "1",
}));

jest.mock("urlencoded-body-parser", () =>
  jest.fn(() => Promise.resolve({ model: "ASOS" }))
);

describe("Middleware Functions", () => {
  describe("setFormSubmissionCookie()", () => {
    let context;
    let mockSeedCacheFn;

    beforeEach(() => {
      context = {
        res: {
          setHeader: jest.fn(),
        },
        req: { cookies: {} },
      };
      mockSeedCacheFn = jest.fn();
    });

    const assertCookieSet = async () => {
      await setFormSubmissionCookie(context, mockSeedCacheFn);

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        "submissionId=1; Path=/; HttpOnly; SameSite=Lax"
      );
    };

    it("should set the form submission cookie if there are no cookies", async () => {
      await assertCookieSet();
    });

    it("should set the form submission cookie value if it is set to null", async () => {
      context.req.cookies = { [submissionCookieId]: null };
      await assertCookieSet();
    });

    it("should set the form submission cookie value if it is set to undefined", async () => {
      context.req.cookies = { [submissionCookieId]: void 0 };
      await assertCookieSet();
    });

    it("should not set the form submission cookie header if one is set", () => {
      context.req.cookies = { [submissionCookieId]: "2" };
      setFormSubmissionCookie(context);
      expect(context.res.setHeader).not.toHaveBeenCalled();
    });
  });

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
