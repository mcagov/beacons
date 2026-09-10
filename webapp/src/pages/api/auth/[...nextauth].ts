import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import CredentialsProvider from "next-auth/providers/credentials";
import { toArray } from "../../../lib/utils";
import {
  isLocalAuthEnabled,
  localAuthProviderId,
  localCredentialsAreValid,
  localUser,
} from "../../../lib/localAuth";

const debug = process.env.NODE_ENV !== "production";
const tenantName = process.env.AZURE_B2C_TENANT_NAME;
const userFlow = process.env.AZURE_B2C_LOGIN_FLOW;
const clientId = process.env.AZURE_B2C_CLIENT_ID;
const clientSecret = process.env.AZURE_B2C_CLIENT_SECRET;

const azureB2CProvider = AzureADB2CProvider({
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
});

const localProvider = CredentialsProvider({
  id: localAuthProviderId,
  name: "Local development",
  credentials: {
    email: { label: "Email address", type: "text" },
    password: { label: "Password", type: "password" },
  },
  authorize(credentials) {
    if (
      !credentials ||
      !localCredentialsAreValid(credentials.email, credentials.password)
    ) {
      return null;
    }

    const user = localUser();

    // "id" becomes the JWT's "sub" claim, which the session callback exposes as authId
    return { id: user.id, name: user.name, email: user.email };
  },
});

// B2C's cross-site redirect needs SameSite=None, which requires Secure. Browsers reject Secure
// cookies on http://localhost, so local sign-in keeps the default SameSite=Lax cookie.
const callbackUrlCookie = {
  callbackUrl: {
    name: "next-auth.callback-url",
    options: {
      httpOnly: true,
      sameSite: "none" as const,
      path: "/",
      secure: true,
    },
  },
};

const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  debug,
  providers: isLocalAuthEnabled() ? [localProvider] : [azureB2CProvider],
  callbacks: {
    async session({ session, token }) {
      session.user["authId"] = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  cookies: isLocalAuthEnabled() ? {} : callbackUrlCookie,
};

export default NextAuth(options);
