import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { AuthContext } from "./auth/AuthProvider";

/**
 * For triggering actions in the Service while authenticated as the user
 *
 * @param url the API endpoint to which to POST
 */
export function AuthenticatedPOSTButton({
  uri,
  children,
}: {
  uri: string;
  children: React.ReactNode;
}): JSX.Element {
  const performAction =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      await fetch(uri, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(() => {
          console.info(`Successfully POSTed to ${uri}`);
        })
        .catch((e) => {
          console.error(`Error while POSTing to ${uri}: ${e}`);
        });
    };

  return (
    <>
      <AuthContext.Consumer>
        {(auth) => (
          <Button
            component="a"
            onClick={performAction(auth.accessToken)}
            color="inherit"
            variant="outlined"
            fullWidth
          >
            {children}
          </Button>
        )}
      </AuthContext.Consumer>
    </>
  );
}
