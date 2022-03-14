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
      main: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#007cb8",
      contrastText: "#fff",
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
