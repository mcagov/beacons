import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { toArray } from "../../../lib/utils";

const debug = process.env.NODE_ENV !== "production";
const tenantName = process.env.AZURE_B2C_TENANT_NAME;
const userFlow = process.env.AZURE_B2C_LOGIN_FLOW;
const clientId = process.env.AZURE_B2C_CLIENT_ID;
const clientSecret = process.env.AZURE_B2C_CLIENT_SECRET;

const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  debug,
  providers: [
    AzureADB2CProvider({
      id: "azureb2c",
      tenantId: tenantName,
      clientId,
      clientSecret,
      primaryUserFlow: userFlow,
      authorization: {
        params: {
          scope: "openid offline_access",
        },
      },
      profile(profile) {
        const emails = toArray(profile.emails as any);
        return {
          id: profile.sub,
          name: `${profile.given_name ?? ""} ${profile.family_name ?? ""}`.trim(),
          email: emails[0],
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user["authId"] = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  cookies: {
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
};

export default NextAuth(options);
