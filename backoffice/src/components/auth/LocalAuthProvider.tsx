import React, { FunctionComponent } from "react";
import { Role } from "../../lib/User";
import { AuthContext } from "./AuthProvider";

interface LocalAuthProviderProps {
  children: React.ReactNode;
  username: string;
  displayName: string;
  roles: Role[];
  apiAccessToken: string;
}

export const LocalAuthProvider: FunctionComponent<LocalAuthProviderProps> = ({
  children,
  username,
  displayName,
  roles,
  apiAccessToken,
}: LocalAuthProviderProps): JSX.Element => (
  <AuthContext.Provider
    value={{
      user: {
        type: "loggedInUser",
        attributes: { username, displayName, roles },
        apiAccessToken,
      },
      logout: () => {
        window.alert(
          "Sign-out is unavailable in local development: there is no Azure AD session to end.",
        );
      },
    }}
  >
    {children}
  </AuthContext.Provider>
);
