import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import React, { useEffect } from "react";
import { Role, User, UserAttributes, userReducer } from "../../lib/User";

export interface IAuthContext {
  user: User;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { instance, accounts } = useMsal();
  const [user, dispatch] = React.useReducer(userReducer, {
    type: "loggedOutUser",
  });

  useEffect(() => {
    if (accounts.length > 0) {
      dispatch({
        type: "login",
        userAttributes: getUserAttributes(accounts[0]),
      });
    }
  }, [accounts]);

  useEffect(() => {
    if (user.type === "loggedInUser" && user.apiAccessToken == null) {
      getApiAccessToken(instance).then((apiAccessToken) => {
        dispatch({ type: "set_api_access_token", apiAccessToken });
      });
    }
  }, [instance, user]);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        logout: instance.logoutRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): IAuthContext {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error(
      "useAuthContext needs to be used within an AuthContextProvider"
    );
  }

  return context;
}

const getUserAttributes = (accountInfo: AccountInfo): UserAttributes => {
  return {
    username: accountInfo.username,
    displayName: accountInfo.name,
    roles: (accountInfo.idTokenClaims as Record<string, Role[]>)?.roles,
  };
};

const getApiAccessToken = async (
  pca: IPublicClientApplication
): Promise<string> => {
  const account = pca.getAllAccounts()[0];

  const accessTokenRequest = {
    scopes: [`api://${pca.getConfiguration().auth.clientId}/access_as_user`],
    account: account,
  };

  const response = await pca.acquireTokenSilent(accessTokenRequest);

  return response.accessToken;
};
