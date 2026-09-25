import { Configuration } from "@azure/msal-browser";
import React from "react";
import { Role } from "./User";

export interface LocalAuthConfig {
  username: string;
  displayName: string;
  roles: Role[];
}

export type AuthState =
  | { status: "OK"; config: Configuration }
  | { status: "LOCAL"; config: LocalAuthConfig }
  | { status: "ERROR"; error: string }
  | { status: "PENDING"; retryCount: number };

export const useGetAuthState = (): AuthState => {
  const [authState, setAuthState] = React.useState<AuthState>({
    status: "PENDING",
    retryCount: 0,
  });

  React.useEffect(() => {
    if (authState.status === "PENDING") {
      getAuthMode()
        .then((authMode) => {
          if (authMode?.mode === "local") {
            const { username, displayName, roles } = authMode;
            setAuthState({
              status: "LOCAL",
              config: { username, displayName, roles },
            });
            return;
          }

          return Promise.all([getTenantId(), getClientId()]).then(
            ([tenantId, clientId]) => {
              setAuthState({
                status: "OK",
                config: {
                  auth: {
                    clientId: clientId,
                    authority: `https://login.microsoftonline.com/${tenantId}`,
                  },
                  cache: {
                    cacheLocation: "localStorage",
                  },
                },
              });
            },
          );
        })
        .catch((error) => {
          setAuthState((authState) => {
            if (authState.status === "PENDING" && authState.retryCount < 10) {
              return {
                status: "PENDING",
                retryCount: authState.retryCount + 1,
              };
            } else {
              return {
                status: "ERROR",
                error: JSON.stringify(error),
              };
            }
          });
        });
    }
  }, [authState]);

  return authState;
};

type AuthMode = ({ mode: "local" } & LocalAuthConfig) | { mode: "azure" };

const getAuthMode = async (): Promise<AuthMode | null> => {
  if (!import.meta.env.DEV) return null;

  try {
    const response = await fetch("/backoffice/auth-mode");
    if (!response.ok) return null;

    return (await response.json()) as AuthMode;
  } catch {
    return null;
  }
};

const getTenantId = async (): Promise<string> =>
  fetch("/backoffice/tenant-id").then((response) => response.text());

const getClientId = (): Promise<string> =>
  fetch("/backoffice/client-id").then((response) => response.text());
