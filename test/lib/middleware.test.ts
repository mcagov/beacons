import { FormCacheFactory } from "../../src/lib/form-cache";
import {
  cookieRedirect,
  getCache,
  setCookieSubmissionId,
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
  jest.fn(() => Promise.resolve({ beaconModel: "ASOS" }))
);

describe("Middleware Functions", () => {
  describe("cookeRedirect()", () => {
    let context;
    let writeHeadFunction;
    let endFunction;

    beforeEach(() => {
      writeHeadFunction = jest.fn();
      endFunction = jest.fn();

      context = {
        res: {
          writeHead: writeHeadFunction,
        },
        req: { cookies: {} },
      };

      context.res.writeHead.mockReturnValueOnce({ end: endFunction });
    });

    const assertRedirected = () => {
      cookieRedirect(context);

      expect(writeHeadFunction).toHaveBeenCalledWith(307, {
        Location: "/",
      });
      expect(endFunction).toHaveBeenCalledTimes(1);
    };

    const assertNotRedirected = () => {
      cookieRedirect(context);

      expect(writeHeadFunction).not.toHaveBeenCalled();
      expect(endFunction).not.toHaveBeenCalled();
    };

    it("should redirect if there are no cookies", () => {
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

  describe("setCookieSession()", () => {
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
      setCookieSubmissionId(context);

      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Set-Cookie",
        "submissionId=1; Path=/; HttpOnly; SameSite=Strict"
      );
    };

    it("should set the submission cookie header if there are no cookies", () => {
      assertCookieSet();
    });

    it("should set the submission cookie value if it is set to null", () => {
      context.req.cookies = { [submissionCookieId]: null };
      assertCookieSet();
    });

    it("should set the submission cookie value if it is set to undefined", () => {
      context.req.cookies = { [submissionCookieId]: void 0 };
      assertCookieSet();
    });

    it("should not set the submission cookie header if one is set", () => {
      context.req.cookies = { [submissionCookieId]: "2" };

      expect(context.res.setHeader).not.toHaveBeenCalled();
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

      expect(formData).toStrictEqual({ beaconModel: "ASOS" });
    });

    it("should update the cache entry with the form data", async () => {
      await updateFormCache(context);
      const cache = FormCacheFactory.getCache();

      expect(cache.get("1")).toStrictEqual({ beaconModel: "ASOS" });
    });
  });

  describe("getCache()", () => {
    let context;
    const formData = { beaconModel: "ASOS" };
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
