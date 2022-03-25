import { Button } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { AuthContext } from "./auth/AuthWrapper";

export function AuthenticatedDownloadLink({
  url,
  filename,
}: {
  url: string;
  filename: string;
}): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const link = React.useRef<HTMLAnchorElement>(null);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

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
        handleLoading();
        return;
      }

      const blob = await result.blob();
      const href = window.URL.createObjectURL(blob);

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
            disabled={loading}
          >
            Export to Excel
          </Button>
        )}
      </AuthContext.Consumer>
    </>
  );
}
