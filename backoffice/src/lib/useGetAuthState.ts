import { Configuration } from "@azure/msal-browser";
import React from "react";

export type AuthState =
  | { status: "OK"; config: Configuration }
  | { status: "ERROR"; error: string }
  | { status: "PENDING"; retryCount: number };

export const useGetAuthState = (): AuthState => {
  const [authState, setAuthState] = React.useState<AuthState>({
    status: "PENDING",
    retryCount: 0,
  });

  React.useEffect(() => {
    if (authState.status === "PENDING") {
      Promise.all([getTenantId(), getClientId()])
        .then(([tenantId, clientId]) => {
          setAuthState({
            status: "OK",
            config: {
              auth: {
                clientId: clientId,
                authority: `https://login.microsoftonline.com/${tenantId}`,
              },
            },
          });
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

const getTenantId = async (): Promise<string> =>
  fetch("/backoffice/tenant-id").then((response) => response.text());

const getClientId = (): Promise<string> =>
  fetch("/backoffice/client-id").then((response) => response.text());
