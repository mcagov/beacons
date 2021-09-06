import { BeaconsSession } from "../../../src/gateways/NextAuthUserSessionGateway";
import { ErrorPageURLs } from "../../../src/lib/urls";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../src/router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

describe("WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError", () => {
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

    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context as any
    );

    const condition = await rule.condition();
    expect(condition).toBe(true);

    const result = await rule.action();

    expect(mockGetSession).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: ErrorPageURLs.unauthenticated,
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

    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context as any
    );

    const condition = await rule.condition();

    expect(mockGetSession).toHaveBeenCalledTimes(1);
    expect(condition).toBe(false);
  });
});
