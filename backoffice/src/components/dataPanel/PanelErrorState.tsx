import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FunctionComponent } from "react";

interface IPanelError {
  message?: string;
}

export const ErrorState: FunctionComponent<IPanelError> = ({
  message,
  children,
}): JSX.Element => (
  <Box role="alert" textAlign="center">
    <ErrorOutlineIcon />
    <Typography>{message ?? children}</Typography>
  </Box>
);
