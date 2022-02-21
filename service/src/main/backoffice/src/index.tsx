import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  Theme,
  adaptV4Theme,
} from "@mui/material/styles";
import "fontsource-roboto";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { makeServer } from "./server";

if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_NO_API_STUB !== "true"
) {
  makeServer();
}

const theme: Theme = createTheme(
  adaptV4Theme({
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
  })
);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById("root")
);

reportWebVitals();
