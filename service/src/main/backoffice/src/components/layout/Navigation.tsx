import { Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Toolbar from "@mui/material/Toolbar";
import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserMenu } from "../auth/UserMenu";

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

export const Navigation: FunctionComponent = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">
            Beacon records
          </Button>
          <Button color="inherit" component={RouterLink} to="/advanced-search">
            Advanced search
          </Button>
          <Box ml="auto">
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};
