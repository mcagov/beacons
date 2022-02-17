import { Box, Typography } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { FunctionComponent } from "react";

interface IPanelError {
  message: string;
}

export const ErrorState: FunctionComponent<IPanelError> = ({
  message,
}): JSX.Element => (
  <Box role="alert" textAlign="center">
    <ErrorOutlineIcon />
    <Typography>{message}</Typography>
  </Box>
);
