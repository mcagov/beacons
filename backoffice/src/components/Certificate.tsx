import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";
import { Grid } from "@mui/material";

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

interface CertificateProps {
  exportsGateway: IExportsGateway;
}

export const Certificate: FunctionComponent<CertificateProps> = ({
  exportsGateway,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xl={12}>
        <div>OFFICIAL</div>
        <div>UK Distress & Security Beacon Registration</div>
      </Grid>
      <Grid item xs={4}>
        <div>xs=4</div>
      </Grid>
      <Grid item xs={4}>
        <div>xs=4</div>
      </Grid>
      <Grid item xs={8}>
        <div>xs=8</div>
      </Grid>
    </Grid>
  );
};
