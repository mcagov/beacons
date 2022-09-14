import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { Grid } from "@mui/material";
import { ICertificate } from "gateways/exports/ICertificate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      fontFamily: "Arial",
      backgroundColor: "white",
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

interface CertificateProps {
  certificate: ICertificate;
}

export const Certificate: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  const classes = useStyles();
  // later: consider the React version of a v-for
  return (
    <Grid container className={classes.root}>
      <Grid item xl={12}>
        <div>OFFICIAL</div>
        <div>UK Distress & Security Beacon Registration</div>
      </Grid>
      <Grid item xs={6}>
        <div>Coding: {certificate.beacon.coding}</div>
      </Grid>
      <Grid item xs={6}>
        <div>MCA's Contact Number: {certificate.contactNumber}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Created Date: {certificate.beacon.registeredDate}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Csta: {certificate.beacon.csta}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Hex ID: {certificate.beacon.hexId}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Last modified: {certificate.beacon.lastModifiedDate}</div>
      </Grid>
      <Grid item xs={6}>
        <div>MTI: {certificate.beacon.mti}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Vessel Name: {certificate.beacon.uses[0].vesselName}</div>
      </Grid>
      <Grid item xs={6}>
        <div>Protocol: {certificate.beacon.protocol}</div>
      </Grid>
      <Grid item xs={6}>
        <div>SVDR: {certificate.beacon.svdr}</div>
      </Grid>
    </Grid>
  );
};
