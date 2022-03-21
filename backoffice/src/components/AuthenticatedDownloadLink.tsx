import React, { MouseEventHandler } from "react";
import { AuthContext } from "./auth/AuthWrapper";

export function AuthenticatedDownloadLink({
  url,
  filename,
  children,
}: {
  url: string;
  filename: string;
  children: React.ReactNode;
}): JSX.Element {
  const link = React.createRef<HTMLAnchorElement>();

  const downloadFile =
    (accessToken: string | unknown): MouseEventHandler<HTMLAnchorElement> =>
    async () => {
      if (!link.current || link.current.href) {
        return;
      }

      const result = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

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
          <a role="button" ref={link} onClick={downloadFile(auth.accessToken)}>
            {children}
          </a>
        )}
      </AuthContext.Consumer>
    </>
  );
}
