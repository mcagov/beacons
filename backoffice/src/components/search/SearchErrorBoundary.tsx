import { Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { logToServer } from "../../logger";
import { ErrorState } from "../dataPanel/PanelErrorState";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class SearchErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    logToServer.error(error);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorState>
          <Typography component="h1" variant={"h4"}>
            Something went wrong
          </Typography>
          <RouterLink to="/">Back to home</RouterLink>
        </ErrorState>
      );
    }

    return this.props.children;
  }
}
