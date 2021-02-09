import { cookieRedirect } from "../../src/lib/middleware";
import { cookieSessionId } from "../../src/lib/types";

describe("Middleware Functions", () => {
  describe("cookeRedirect", () => {
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

    it("should not redirect if the cookie id is set ", () => {
      context.req.cookies = { [cookieSessionId]: "1" };

      assertNotRedirected();
    });

    it("should redirect if the cookie session id is not set", () => {
      context.req.cookies = { "beacons-session": "1" };

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to null", () => {
      context.req.cookies = { [cookieSessionId]: null };

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to undefined", () => {
      context.req.cookies = { [cookieSessionId]: void 0 };

      assertRedirected();
    });
  });
});
