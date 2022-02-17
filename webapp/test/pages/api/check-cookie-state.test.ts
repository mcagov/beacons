import { acceptRejectCookieId } from "../../../src/lib/types";
import checkCookieState from "../../../src/pages/api/check-cookie-state";

const cookieOptions = "cookie-options";

jest.mock("cookie", () => {
  return {
    serialize: jest.fn().mockImplementation(() => cookieOptions),
  };
});

describe("Check Cookie State", () => {
  let req;
  let referer;
  let res;

  beforeEach(() => {
    referer = "http://localhost";
    req = {
      cookies: {},
      headers: {
        referer,
      },
    };

    res = {
      setHeader: jest.fn(),
      redirect: jest.fn(),
    };
  });

  it("should set the cookie if none exist", () => {
    checkCookieState(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", cookieOptions);
    expect(res.redirect).toHaveBeenCalledWith(303, referer);
  });

  it("should set the cookie if the accept/reject cookie key is not set", () => {
    req.cookies["beacon-cookie"] = "hex-id";
    checkCookieState(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", cookieOptions);
    expect(res.redirect).toHaveBeenCalledWith(303, referer);
  });

  it("should not set the cookie if is already set", () => {
    req.cookies[acceptRejectCookieId] = "id";
    checkCookieState(req, res);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(303, referer);
  });
});
