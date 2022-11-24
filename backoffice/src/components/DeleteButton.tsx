import React, { FunctionComponent } from "react";
import { Button } from "@mui/material";

interface IDeleteButtonProps {
  href: string;
  variant: "text" | "outlined" | "contained" | undefined;
  color:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined;
  resourceToDelete: string;
}

export const DeleteButton: FunctionComponent<IDeleteButtonProps> = ({
  href,
  variant,
  color,
  resourceToDelete,
}): JSX.Element => {
  return (
    <span className="delete-record">
      <Button href={href} variant={variant} color={color}>
        Delete {resourceToDelete}
      </Button>
    </span>
  );
};
