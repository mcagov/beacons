import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { MsalAuthenticationResult } from "@azure/msal-react/dist/hooks/useMsalAuthentication";
import React, { FunctionComponent } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: FunctionComponent<RequireAuthProps> = ({
  children,
}: RequireAuthProps) => {
  const authRequest = {
    scopes: ["openid", "profile"],
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
      errorComponent={ErrorComponent}
      loadingComponent={LoadingComponent}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
};

const ErrorComponent: FunctionComponent<MsalAuthenticationResult> = ({
  error,
}) => {
  console.error(error);
  return <p>An Error Occurred: {JSON.stringify(error)}</p>;
};

const LoadingComponent: FunctionComponent = () => (
  <p>Authentication in progress...</p>
);
