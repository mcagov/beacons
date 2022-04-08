import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { useAuthContext } from "./auth/AuthProvider";

export function AuthenticatedDownloadButton({
  url,
}: {
  url: string;
}): JSX.Element | null {
  const link = React.useRef<HTMLAnchorElement>(null);

  const { user } = useAuthContext();

  const downloadFile =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      if (!link.current || link.current.href) {
        return;
      }

      const result = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (result.status === 503) {
        window.alert("There was an error while downloading.");
        return;
      }

      const filename = parseFilename(result.headers);

      if (!filename) {
        window.alert("There was an error while downloading.");
        return;
      }

      const blob = await result.blob();
      const href = window.URL.createObjectURL(blob);

      link.current.download = filename;
      link.current.href = href;

      link.current.click();
    };

  if (user.type !== "loggedInUser") {
    return null;
  }

  return (
    <Button
      component="a"
      ref={link}
      onClick={downloadFile(user.apiAccessToken)}
      color="inherit"
      variant="outlined"
      fullWidth
    >
      Export to Excel
    </Button>
  );
}

export const parseFilename = (headers: Headers): string | null => {
  const contentDisposition = headers.get("Content-Disposition");
  if (!contentDisposition) return null;

  return contentDisposition.split("filename=")[1];
};
