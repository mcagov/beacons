import { IFormCache } from "../../src/lib/formCache";
import {
  checkHeaderContains,
  clearFormCache,
  clearFormSubmissionCookie,
  decorateGetServerSidePropsContext,
  getCache,
  setFormSubmissionCookie,
  updateFormCache,
  withCookieRedirect,
} from "../../src/lib/middleware";
import { Registration } from "../../src/lib/registration/registration";
import {
  acceptRejectCookieId,
  formSubmissionCookieId,
  formSubmissionCookieId as submissionCookieId,
} from "../../src/lib/types";
import { getCacheMock } from "../mocks";

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

  describe("decorateGetServerSidePropsContext()", () => {
    let context;

    beforeEach(() => {
      context = { req: { cookies: {} }, query: {} };
    });

    it("should decorate the context with false if the user has accepted the cookie policy", async () => {
      context.req.cookies[acceptRejectCookieId] = true;
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.showCookieBanner).toBe(false);
    });

    it("should decorate the context with true if the user has not accepted the cookie policy", async () => {
      context.req.cookies[acceptRejectCookieId] = false;
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.showCookieBanner).toBe(true);
    });

    it("should add the users submission cookie id onto the context", async () => {
      context.req.cookies[formSubmissionCookieId] = "id";
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.submissionId).toBe("id");
    });

    it("should add the users registration onto the context", async () => {
      context.req.cookies[formSubmissionCookieId] = "id";
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.registration).toBeDefined();
      expect(decoratedContext.registration).toBeInstanceOf(Registration);
    });

    it("should parse the form data and add onto the context", async () => {
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.formData).toStrictEqual({ model: "ASOS" });
    });

    it("should set the useIndex to 0 on the context if the useIndex is not set", async () => {
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.useIndex).toStrictEqual(0);
    });

    it("should set the useIndex to 0 if useIndex is null", async () => {
      context.query.useIndex = null;
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.useIndex).toStrictEqual(0);
    });

    it("should set the useIndex on the query param", async () => {
      context.query.useIndex = 1;
      const decoratedContext = await decorateGetServerSidePropsContext(context);
      expect(decoratedContext.useIndex).toStrictEqual(1);
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
    let id;
    let cacheMock: jest.Mocked<IFormCache>;

    beforeEach(() => {
      id = "1";
      cacheMock = getCacheMock();
    });

    it("should update the form cache with the parsed form data", () => {
      updateFormCache(id, { model: "ASOS" }, cacheMock);

      expect(cacheMock.update).toHaveBeenCalledWith("1", { model: "ASOS" });
    });
  });

  describe("getCache()", () => {
    let id;
    let cacheMock: jest.Mocked<IFormCache>;

    beforeEach(() => {
      id = "1";
      cacheMock = getCacheMock();
    });

    it("should call the cache with the correct id", () => {
      const registration = new Registration();
      cacheMock.get.mockReturnValue(registration);

      expect(getCache(id, cacheMock)).toStrictEqual(registration);
      expect(cacheMock.get).toHaveBeenCalledWith(id);
    });
  });

  describe("clearFormCache()", () => {
    let id;
    let cacheMock: jest.Mocked<IFormCache>;

    beforeEach(() => {
      id = "1";
      cacheMock = getCacheMock();
    });

    it("should clear the cache for the id provided", () => {
      clearFormCache(id, cacheMock);
      expect(cacheMock.clear).toHaveBeenCalledWith(id);
    });
  });
});
