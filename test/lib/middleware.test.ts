import { FormCacheFactory } from "../../src/lib/formCache";
import {
  withCookieRedirect,
  getCache,
  checkHeaderContains,
  setFormSubmissionCookie,
  updateFormCache,
} from "../../src/lib/middleware";
import {
  formSubmissionCookieId,
  formSubmissionCookieId as submissionCookieId,
} from "../../src/lib/types";

jest.mock("uuid", () => ({
  v4: () => "1",
}));

jest.mock("urlencoded-body-parser", () =>
  jest.fn(() => Promise.resolve({ model: "ASOS" }))
);

describe("Middleware Functions", () => {
  describe("withCookeRedirect()", () => {
    let context;
    let callback;

    beforeEach(() => {
      callback = jest.fn();

      context = {
        req: { cookies: {} },
      };
    });

    const assertRedirected = async () => {
      const result = await withCookieRedirect(callback)(context);

      expect(result).toStrictEqual({
        redirect: {
          destination: "/",
          permanent: false,
        },
      });
      expect(callback).not.toHaveBeenCalled();
    };

    const assertNotRedirected = async () => {
      await withCookieRedirect(callback)(context);

      expect(callback).toHaveBeenCalledTimes(1);
    };

    it("should redirect if there are no cookies", () => {
      delete context.req.cookies;

      assertRedirected();
    });

    it("should not redirect if submission cookie header is set ", () => {
      context.req.cookies = { [submissionCookieId]: "1" };

      assertNotRedirected();
    });

    it("should redirect if the submission cookie header is not set", () => {
      context.req.cookies = { "beacons-session": "1" };

      assertRedirected();
    });

    it("should redirect if the submission cookie header is set to null", () => {
      context.req.cookies = { [submissionCookieId]: null };

      assertRedirected();
    });

    it("should redirect if the submission cookie header is set to undefined", () => {
      context.req.cookies = { [submissionCookieId]: void 0 };

      assertRedirected();
    });
  });

  describe("setFormSubmissionCookie()", () => {
    let context;

    beforeEach(() => {
      context = {
        res: {
          setHeader: jest.fn(),
        },
        req: { cookies: {} },
      };
    });

    const assertCookieSet = () => {
      setFormSubmissionCookie(context);

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        "submissionId=1; Path=/; HttpOnly; SameSite=Strict"
      );
    };

    it("should set the form submission cookie if there are no cookies", () => {
      assertCookieSet();
    });

    it("should set the form submission cookie value if it is set to null", () => {
      context.req.cookies = { [submissionCookieId]: null };
      assertCookieSet();
    });

    it("should set the form submission cookie value if it is set to undefined", () => {
      context.req.cookies = { [submissionCookieId]: void 0 };
      assertCookieSet();
    });

    it("should not set the form submission cookie header if one is set", () => {
      context.req.cookies = { [submissionCookieId]: "2" };

      expect(context.res.setHeader).not.toHaveBeenCalled();
    });
  });

  describe("checkHeaderContains()", () => {
    let request;

    beforeEach(() => {
      request = {
        headers: {
          referer: "http://localhost/intent",
        },
      };
    });

    it("should return true if the header contains the provided value", () => {
      expect(checkHeaderContains(request, "referer", "/intent")).toBe(true);
    });

    it("should return false if the header does not contain the provided value", () => {
      expect(
        checkHeaderContains(request, "referer", "/register-a-beacon")
      ).toBe(false);
    });

    it("should return false if there is no referer header", () => {
      request.headers = {};
      expect(checkHeaderContains(request, "referer", "/intent")).toBe(false);
    });

    it("should return false if the header is not in the request", () => {
      expect(checkHeaderContains(request, "accept-language", "eng")).toBe(
        false
      );
    });

    it("should return true if header contains full path of the referer header", () => {
      request.headers.referer =
        "http://localhost/register-a-beacon/check-beacon-details";
      expect(
        checkHeaderContains(
          request,
          "referer",
          "register-a-beacon/check-beacon-details"
        )
      ).toBe(true);
    });

    it("should return false if only the first path of the url matches", () => {
      request.headers.referer =
        "http://localhost/register-a-beacon/check-beacon-details";
      expect(
        checkHeaderContains(
          request,
          "referer",
          "register-a-beacon/check-beacon-summary"
        )
      ).toBe(false);
    });
  });

  describe("updateFormCache()", () => {
    let context;

    beforeEach(() => {
      context = {
        req: { cookies: { [formSubmissionCookieId]: "1" } },
      };
    });

    it("should update the form cache with the parsed form data", async () => {
      const formData = await updateFormCache(context);

      expect(formData).toStrictEqual({ model: "ASOS" });
    });

    it("should update the cache entry with the form data", async () => {
      await updateFormCache(context);
      const cache = FormCacheFactory.getCache();

      expect(cache.get("1")).toStrictEqual({ model: "ASOS" });
    });
  });

  describe("getCache()", () => {
    let context;
    const formData = { model: "ASOS" };
    const id = "1";

    beforeEach(() => {
      context = {
        req: { cookies: { [formSubmissionCookieId]: id } },
      };
    });

    it("should return the form data stored within the cache for a given submission id", () => {
      const cache = FormCacheFactory.getCache();
      cache.update(id, formData);

      expect(getCache(context)).toStrictEqual(formData);
    });

    it("should return empty form data if the id is not found", () => {
      context.req.cookies = { [formSubmissionCookieId]: "not-in-the-cache" };

      expect(getCache(context)).toStrictEqual({});
    });
  });
});
