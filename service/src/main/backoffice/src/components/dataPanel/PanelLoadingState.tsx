import { Box, CircularProgress } from "@material-ui/core";
import { FunctionComponent } from "react";

export const LoadingState: FunctionComponent = () => (
  <Box textAlign="center">
    <CircularProgress />
  </Box>
);
