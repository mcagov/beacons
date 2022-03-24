import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
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
  typography: {
    subtitle2: {
      textTransform: "uppercase",
      margin: "20px 0 10px",
      fontWeight: 700,
      letterSpacing: "0.08rem",
      fontSize: "0.6875rem",
      color: "#6F7E8C",
      lineHeight: 1.5,
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
