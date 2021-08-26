import { BeaconsSession } from "../../../src/gateways/NextAuthUserSessionGateway";
import { PageURLs } from "../../../src/lib/urls";
import { IfUserDoesNotHaveValidSession } from "../../../src/router/rules/IfUserDoesNotHaveValidSession";

describe("IfUserDoesNotHaveValidSession", () => {
  it("should route the user to the sign up or sign in page if the session is not valid", async () => {
    const mockGetSession = jest.fn();
    mockGetSession.mockReturnValueOnce(null);

    const context = {
      container: {
        sessionGateway: {
          getSession: mockGetSession,
        },
      },
    };

    const rule = new IfUserDoesNotHaveValidSession(context as any);

    const condition = await rule.condition();
    expect(condition).toBe(true);

    const result = await rule.action();

    expect(mockGetSession).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: PageURLs.signUpOrSignIn,
      },
    });
  });

  it("should not trigger if the user has a valid session", async () => {
    const mockGetSession = jest.fn();
    const session: BeaconsSession = {
      user: {
        authId: "foo",
        name: "bar",
        email: "baz",
        image: "qux",
      },
      expires: "quux",
    };
    mockGetSession.mockReturnValueOnce(session);

    const context = {
      container: {
        sessionGateway: {
          getSession: mockGetSession,
        },
      },
    };

    const rule = new IfUserDoesNotHaveValidSession(context as any);

    const condition = await rule.condition();

    expect(mockGetSession).toHaveBeenCalledTimes(1);
    expect(condition).toBe(false);
  });
});
