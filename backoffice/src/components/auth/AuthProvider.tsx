import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import React, { createContext, FunctionComponent, useEffect } from "react";
import { Role, User } from "../../lib/User";

export interface IAuthContext {
  user: User | null;
  accessToken: string | null;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  accessToken: null,
  logout: () => {},
});

export const AuthProvider: FunctionComponent<{
  pca: IPublicClientApplication;
}> = ({ pca, children }) => {
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    getAccessToken(pca).then((token) => {
      setAuthToken(token);
    });
  }, []);

  useEffect(() => {
    setUser(createUser(pca.getAllAccounts()[0]));
  }, []);

  return (
    <MsalProvider instance={pca}>
      <AuthContext.Provider
        value={{
          user: user,
          accessToken: authToken,
          logout: () => pca.logoutRedirect(),
        }}
      >
        {children}
      </AuthContext.Provider>
    </MsalProvider>
  );
};

const createUser = (accountInfo: AccountInfo): User => {
  return {
    username: accountInfo?.username ?? null,
    displayName: accountInfo?.name ?? null,
    roles:
      ((accountInfo?.idTokenClaims as Record<string, string>)
        ?.roles as unknown as Role[]) ?? null,
  };
};

const getAccessToken = async (
  pca: IPublicClientApplication
): Promise<string | null> => {
  const account = pca.getAllAccounts()[0];

  if (account) {
    const accessTokenRequest = {
      scopes: [`api://${pca.getConfiguration().auth.clientId}/access_as_user`],
      account: account,
    };

    const response = await pca.acquireTokenSilent(accessTokenRequest);

    return response.accessToken;
  } else {
    return null;
  }
};
