import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import React, { createContext, FunctionComponent } from "react";
import { AuthGateway } from "../../gateways/auth/AuthGateway";

export interface IAuthContext {
  user: {
    username: string | unknown;
    displayName: string | unknown;
  };
  getAccessToken: () => Promise<string | unknown>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: {
    username: null,
    displayName: null,
  },
  getAccessToken: () => Promise.resolve(null),
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

const MsalShim: FunctionComponent<{
  pca: IPublicClientApplication;
  authGateway: AuthGateway;
}> = ({ pca, authGateway, children }) => {
  /**
   * Wrapper for the MSAL auth context.
   *
   * @remarks
   * Acts as a shim between MSAL and the Beacons Backoffice application so that high-level components can consume
   * authenticated user data without depending on a concrete auth provider.
   *
   */
  const currentUser = useMsal().instance.getAllAccounts()[0] || {};

  return (
    <AuthContext.Provider
      value={{
        user: {
          username: currentUser.username,
          displayName: currentUser.name,
        },
        getAccessToken: () => authGateway.getAccessToken(),
        logout: () => pca.logoutRedirect(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
