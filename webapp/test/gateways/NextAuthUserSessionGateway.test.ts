import { GetServerSidePropsContext } from "next";
import * as nextAuthReact from "next-auth/react";
import { NextAuthUserSessionGateway } from "../../src/gateways/NextAuthUserSessionGateway";

jest.mock("next-auth/react");
const mockedNextAuthClient = nextAuthReact as jest.Mocked<typeof nextAuthReact>;

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
    mockedNextAuthClient.getSession.mockResolvedValue(mockSession);
    const context = {};
    const userSessionGateway = new NextAuthUserSessionGateway();

    const result = await userSessionGateway.getSession(
      context as GetServerSidePropsContext,
    );

    expect(result).toStrictEqual(mockSession);
    expect(mockedNextAuthClient.getSession).toHaveBeenCalledWith(context);
  });

  it("returns null if there is no session", async () => {
    mockedNextAuthClient.getSession.mockResolvedValue(null);
    const context = {};
    const userSessionGateway = new NextAuthUserSessionGateway();

    const result = await userSessionGateway.getSession(
      context as GetServerSidePropsContext,
    );
    expect(result).toStrictEqual(null);
  });
});
