import { cookieRedirect } from "../../src/lib/middleware";
import { cookieSessionId } from "../../src/lib/types";

describe("Middleware Functions", () => {
  describe("cookeRedirect", () => {
    let context;
    let endFunction;

    beforeEach(() => {
      context = {
        res: {
          writeHead: jest.fn(),
        },
        req: { cookies: {} },
      };

      endFunction = jest.fn();

      context.res.writeHead.mockReturnValueOnce({ end: endFunction });
    });

    const assertRedirected = () => {
      expect(context.res.writeHead).toHaveBeenCalledWith(307, {
        Location: "/",
      });
      expect(endFunction).toHaveBeenCalledTimes(1);
    };

    it("should redirect if there are no cookies", () => {
      cookieRedirect(context);

      assertRedirected();
    });

    it("should not redirect if the cookie id is set ", () => {
      context.req.cookies = { [cookieSessionId]: "1" };

      cookieRedirect(context);

      expect(context.res.writeHead).not.toHaveBeenCalled();
    });

    it("should redirect if the cookie session id is not set", () => {
      context.req.cookies = { "beacons-session": "1" };

      cookieRedirect(context);

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to null", () => {
      context.req.cookies = { [cookieSessionId]: null };

      cookieRedirect(context);

      assertRedirected();
    });

    it("should redirect if the cookie session id is set to undefined", () => {
      context.req.cookies = { [cookieSessionId]: void 0 };

      cookieRedirect(context);

      assertRedirected();
    });
  });
});
