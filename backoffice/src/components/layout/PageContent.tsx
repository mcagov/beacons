import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
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
