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
      padding: "0.5%",
    },
    header: {
      borderBottom: "3px solid black",
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
  return (
    <Grid container className={classes.root}>
      <Grid className={classes.header} container spacing={0.5}>
        <Grid item xl={12}>
          <div>OFFICIAL</div>
          <h3>UK Distress & Security Beacon Registration</h3>
        </Grid>
        <Grid item xs={6}>
          <div>
            PROOF OF REGISTRATION: {certificate.proofOfRegistrationDate}
          </div>
          <Grid item xs={6}>
            <div>DEPT REF: {certificate.beacon.referenceNumber}</div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <div>RECORD CREATED DATE: {certificate.beacon.registeredDate}</div>
        </Grid>
        <Grid item xs={6}>
          <div>BEACON STATUS: {certificate.beacon.status}</div>
        </Grid>
        <Grid item xs={6}>
          <div>LAST MODIFIED: {certificate.beacon.lastModifiedDate}</div>
        </Grid>
      </Grid>

      {/* // beacon details */}

      <Grid item xs={6}>
        <div>MCA's Contact Number: {certificate.mcaContactNumber}</div>
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
        <div>Vessel Name: {certificate.uses[0].vesselName}</div>
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
