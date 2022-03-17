import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  Theme,
} from "@mui/material/styles";
import "fontsource-roboto";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#0b0c0c",
      contrastText: "#fff",
      light: "#b1b4b6",
      dark: "#0b0c0c",
    },
    secondary: {
      main: "#1d70b8",
      contrastText: "#fff",
      light: "#5694ca",
      dark: "#003078",
    },
    background: {
      default: "#eeeeee",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: "secondary",
      },
      styleOverrides: {
        track: {
          backgroundColor: "white",
        },
      },
    },
  },
});

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById("root")
);

reportWebVitals();
