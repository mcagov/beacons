import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { FunctionComponent, ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      marginBottom: "100px",
    },
  })
);

export const PageContent: FunctionComponent<PageContentProps> = ({
  children,
}: PageContentProps): JSX.Element => {
  const classes = useStyles();
  return <Box className={classes.root}>{children}</Box>;
};
