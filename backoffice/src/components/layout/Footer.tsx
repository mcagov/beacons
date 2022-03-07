import AppBar from "@mui/material/AppBar";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Toolbar from "@mui/material/Toolbar";
import React, { FunctionComponent } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    mcaLogo: {
      height: "100px",
    },
  })
);

export const Footer: FunctionComponent = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img
            src={process.env.PUBLIC_URL + "/mca-logo-dark.png"}
            alt="mca logo"
            className={classes.mcaLogo}
          />
          UK 406MHz Beacon Registry
        </Toolbar>
      </AppBar>
    </div>
  );
};