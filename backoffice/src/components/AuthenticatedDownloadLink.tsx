import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { AuthContext } from "./auth/AuthProvider";

export function AuthenticatedDownloadLink({
  url,
}: {
  url: string;
}): JSX.Element {
  const link = React.useRef<HTMLAnchorElement>(null);

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
        return;
      }

      const blob = await result.blob();
      const href = window.URL.createObjectURL(blob);

      const filename = parseFilename(result.headers);

      if (!filename) {
        window.alert("There was an error while downloading.");
        console.error(
          "Filename missing during download.  Headers were: ",
          result.headers
        );
        return;
      }

      link.current.download = filename;
      link.current.href = href;

      link.current.click();
    };

  return (
    <>
      <AuthContext.Consumer>
        {(auth) => (
          <Button
            component="a"
            ref={link}
            onClick={downloadFile(auth.accessToken)}
            color="inherit"
            variant="outlined"
            fullWidth
          >
            Export to Excel
          </Button>
        )}
      </AuthContext.Consumer>
    </>
  );
}

export const parseFilename = (headers: Headers): string | null => {
  const contentDisposition = headers.get("Content-Disposition");
  if (!contentDisposition) return null;

  return contentDisposition.split("filename=")[1];
};
