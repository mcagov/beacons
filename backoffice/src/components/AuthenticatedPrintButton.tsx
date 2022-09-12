import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { useAuthContext } from "./auth/AuthProvider";

export function AuthenticatedPrintButton({
  url,
  label,
  isFullWidth,
}: {
  url: string;
  label: string;
  isFullWidth: boolean;
}): JSX.Element | null {
  const link = React.useRef<HTMLAnchorElement>(null);

  const { user } = useAuthContext();

  const printFile =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      if (!link.current || link.current.href) {
        return;
      }

      // to-do: abstract into separate function to get the file
      const result = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (result.status === 503) {
        window.alert("There was an error while preparing the file.");
        return;
      }

      const filename = parseFilename(result.headers);

      if (!filename) {
        window.alert("There was an error while preparing the file.");
        return;
      }

      // then print it
      const file = await result.blob();
      const href = window.URL.createObjectURL(file);
      window.open(href, "PRINT", "height=400,width=600");
    };

  if (user.type !== "loggedInUser") {
    return null;
  }

  return (
    <Button
      component="a"
      ref={link}
      onClick={printFile(user.apiAccessToken)}
      color="inherit"
      variant="outlined"
      fullWidth={isFullWidth}
    >
      {label}
    </Button>
  );
}

export const parseFilename = (headers: Headers): string | null => {
  const contentDisposition = headers.get("Content-Disposition");
  if (!contentDisposition) {
    return null;
  }

  return contentDisposition.split("filename=")[1];
};
