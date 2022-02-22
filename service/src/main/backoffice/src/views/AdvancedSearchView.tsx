import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import React from "react";
import { PageContent } from "../components/layout/PageContent";
import { Paper } from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      height: "80vh",
      minHeight: "80vh",
    },
  })
);

export function AdvancedSearchView(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <></>
        </Paper>
      </PageContent>
    </div>
  );
}
