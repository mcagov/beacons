import { Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { IExportsGateway } from "gateways/exports/IExportsGateway";
import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserMenu } from "../auth/UserMenu";
import { SettingsDrawer } from "./SettingsDrawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface INavigationProps {
  exportsGateway: IExportsGateway;
}

export const Navigation: FunctionComponent<INavigationProps> = ({
  exportsGateway,
}): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">
            Beacon records
          </Button>
          <Box ml="auto">
            <UserMenu />
            <SettingsDrawer exportsGateway={exportsGateway} />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};
