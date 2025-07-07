import { Button, ButtonProps } from "@mui/material";
import React from "react";

export function FeedbackButton({
  variant,
  color,
  fullWidth = false,
}: Pick<ButtonProps, "variant" | "color" | "fullWidth">) {
  return (
    <Button
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      component="a"
      href={`mailto:${import.meta.env.VITE_APP_FEEDBACK_EMAIL_ADDRESSES}`}
      target="_blank"
    >
      Submit feedback
    </Button>
  );
}
