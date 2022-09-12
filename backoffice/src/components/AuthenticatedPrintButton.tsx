import { Button } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";
import React, { MouseEventHandler } from "react";
import { useAuthContext } from "./auth/AuthProvider";
import { parseFilename } from "utils/FileExportUtils";

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

      const result = await getFile(accessToken);

      if (result.status === 503) {
        window.alert("There was an error while preparing the file.");
        return;
      }

      const filename = parseFilename(result.headers);

      if (!filename) {
        window.alert("There was an error while preparing the file.");
        return;
      }

      openPrintWindow(result);
    };

  async function getFile(accessToken: string | unknown): Promise<Response> {
    const result = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return result;
  }

  async function openPrintWindow(result: Response): Promise<void> {
    const file = await result.blob();
    const href = window.URL.createObjectURL(file);
    window.open(href, "PRINT", "height=800,width=1000");
  }

  if (user.type !== "loggedInUser") {
    return null;
  }

  return (
    <Button
      component="a"
      ref={link}
      onClick={printFile(user.apiAccessToken)}
      variant="outlined"
      fullWidth={isFullWidth}
      endIcon={<ContentPrintIcon />}
    >
      {label}
    </Button>
  );
}
