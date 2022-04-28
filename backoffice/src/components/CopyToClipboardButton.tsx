import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Button, ButtonProps, Snackbar } from "@mui/material";
import React from "react";

export function CopyToClipboardButton({
  text,
  variant,
  color,
  fullWidth = false,
}: { text: string } & Pick<ButtonProps, "variant" | "color" | "fullWidth">) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        color={color}
        variant={variant}
        fullWidth={fullWidth}
        component="a"
        target="_blank"
        onClick={() => {
          navigator.clipboard.writeText(text);
          setOpen(true);
        }}
        endIcon={<ContentPasteIcon />}
      >
        Copy to clipboard
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={"Copied to clipboard"}
      />
    </>
  );
}
