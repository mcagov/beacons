import { Button, ButtonProps } from "@mui/material";
import React from "react";

export function FeedbackButton({
  variant,
  color,
}: Pick<ButtonProps, "variant" | "color">) {
  return (
    <Button
      color={color}
      variant={variant}
      component="a"
      href={`mailto:${process.env.REACT_APP_FEEDBACK_EMAIL_ADDRESSES}`}
      target="_blank"
    >
      Submit feedback
    </Button>
  );
}
