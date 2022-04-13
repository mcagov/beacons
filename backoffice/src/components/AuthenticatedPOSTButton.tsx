import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { logToServer } from "../utils/logger";
import { useAuthContext } from "./auth/AuthProvider";

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
}): JSX.Element | null {
  const { user } = useAuthContext();

  const performAction =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      await fetch(uri, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch((e) => {
        logToServer.error(`Error while POSTing to ${uri}: ${e}`);
      });
    };

  if (user.type !== "loggedInUser") {
    return null;
  }

  return (
    <Button
      component="a"
      onClick={performAction(user.apiAccessToken)}
      color="inherit"
      variant="outlined"
      fullWidth
    >
      {children}
    </Button>
  );
}
