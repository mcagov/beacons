import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { parseFilename } from "utils/FileExportUtils";
import { useAuthContext } from "./auth/AuthProvider";

export function AuthenticatedDownloadButton({
  url,
  label,
  isFullWidth,
  downloadStarted,
  downloadComplete,
}: {
  url: string;
  label: string;
  isFullWidth: boolean;
  downloadStarted?: () => void;
  downloadComplete?: (complete: boolean) => void;
}): JSX.Element | null {
  const link = React.useRef<HTMLAnchorElement>(null);

  const { user } = useAuthContext();

  const downloadFile =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      if (!link.current || link.current.href) {
        return;
      }

      if (downloadStarted) {
        downloadStarted();
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

      if (downloadComplete) {
        downloadComplete(true);
      }
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
      fullWidth={isFullWidth}
    >
      {label}
    </Button>
  );
}
