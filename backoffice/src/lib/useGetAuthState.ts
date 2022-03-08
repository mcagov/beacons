import { Configuration } from "@azure/msal-browser";
import React from "react";

export type AuthState =
  | { status: "OK"; config: Configuration }
  | { status: "ERROR"; error: string }
  | { status: "PENDING" };

export const useGetAuthState = (): AuthState => {
  const [authState, setAuthState] = React.useState<AuthState>({
    status: "PENDING",
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
          setAuthState({
            status: "ERROR",
            error: JSON.stringify(error),
          });
          console.error(JSON.stringify(error));
        });
    }
  }, [authState, setAuthState]);

  return authState;
};

const getTenantId = async (): Promise<string> =>
  fetch("/backoffice/tenant-id").then((response) => response.text());

const getClientId = (): Promise<string> =>
  fetch("/backoffice/client-id").then((response) => response.text());
