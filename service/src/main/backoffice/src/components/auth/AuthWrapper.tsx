import { IPublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import React, { FunctionComponent } from "react";
import { AuthContext } from "./AuthContext";

export const AuthWrapper: FunctionComponent<{
  pca: IPublicClientApplication;
}> = ({ pca, children }) => {
  return (
    <MsalProvider instance={pca}>
      <MsalShim pca={pca}>{children}</MsalShim>
    </MsalProvider>
  );
};

const MsalShim: FunctionComponent<{ pca: IPublicClientApplication }> = ({
  pca,
  children,
}) => {
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
          username: currentUser?.username || "",
          displayName: currentUser?.name || "",
        },
        logout: () => pca.logoutRedirect(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
