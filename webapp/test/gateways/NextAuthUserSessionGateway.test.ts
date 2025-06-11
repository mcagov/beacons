import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { NextAuthUserSessionGateway } from "../../src/gateways/NextAuthUserSessionGateway";

// Mock getSession from next-auth/react
jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}));

describe("NextAuthUserSessionGateway", () => {
  it("returns the user's session using the context provided", async () => {
    const mockSession = {
      user: {
        authId: "test-id",
        name: "Jack Black",
        email: "School@Of.Rock",
      },
      expires: "never",
    };
    // Type assertion needed for TS to recognize the mock
    (getSession as jest.Mock).mockResolvedValue(mockSession);

    const context = {};
    const userSessionGateway = new NextAuthUserSessionGateway();

    const result = await userSessionGateway.getSession(
      context as GetServerSidePropsContext,
    );

    expect(result).toStrictEqual(mockSession);
    expect(getSession).toHaveBeenCalledWith(context);
  });

  it("returns null if there is no session", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const context = {};
    const userSessionGateway = new NextAuthUserSessionGateway();

    const result = await userSessionGateway.getSession(
      context as GetServerSidePropsContext,
    );
    expect(result).toStrictEqual(null);
  });
});
