import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import React, { createContext, FunctionComponent, useEffect } from "react";
import { AuthGateway } from "../../gateways/auth/AuthGateway";

export interface IAuthContext {
  user: {
    username: string | unknown;
    displayName: string | unknown;
  };
  accessToken: string | unknown;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: {
    username: null,
    displayName: null,
  },
  accessToken: null,
  logout: () => {},
});

export const AuthWrapper: FunctionComponent<{
  pca: IPublicClientApplication;
  authGateway: AuthGateway;
}> = ({ pca, authGateway, children }) => {
  return (
    <MsalProvider instance={pca}>
      <MsalShim pca={pca} authGateway={authGateway}>
        {children}
      </MsalShim>
    </MsalProvider>
  );
};

/**
 * Wrapper for the MSAL auth context.
 *
 * @remarks
 * Acts as a shim between MSAL and the Beacons Backoffice application so that high-level components can consume
 * authenticated user data without depending on a concrete auth provider.
 *
 */
const MsalShim: FunctionComponent<{
  pca: IPublicClientApplication;
  authGateway: AuthGateway;
}> = ({ pca, authGateway, children }) => {
  const currentUser = useMsal().instance.getAllAccounts()[0] || {};

  const [authToken, setAuthToken] = React.useState<string>("");

  useEffect(() => {
    if (!authToken) {
      getSpringApiAuthToken();
    }
  }, []);

  const getSpringApiAuthToken = async () => {
    setAuthToken(await authGateway.getAccessToken());
  };

  return (
    <AuthContext.Provider
      value={{
        user: {
          username: currentUser.username,
          displayName: currentUser.name,
        },
        accessToken: authToken,
        logout: () => pca.logoutRedirect(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
