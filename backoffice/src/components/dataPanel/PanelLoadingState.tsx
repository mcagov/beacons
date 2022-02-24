import { Box, CircularProgress } from "@mui/material";
import { FunctionComponent } from "react";

export const LoadingState: FunctionComponent = () => (
  <Box textAlign="center">
    <CircularProgress />
  </Box>
);
