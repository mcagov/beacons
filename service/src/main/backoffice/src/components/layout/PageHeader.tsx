import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FunctionComponent, ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: "left",
      padding: theme.spacing(3),
    },
  })
);

export const PageHeader: FunctionComponent<PageHeaderProps> = ({
  children,
}: PageHeaderProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <h2>{children}</h2>
      </Grid>
    </div>
  );
};
