import { Paper } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";
import { PageContent } from "./layout/PageContent";
import { PageHeader } from "./layout/PageHeader";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

export const Home: FunctionComponent = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageHeader>
        <div>Overview page header</div>
      </PageHeader>
      <PageContent>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
        <Paper className={classes.paper}>
          Example content for overview page
        </Paper>
      </PageContent>
    </div>
  );
};
