import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { ClassNameMap, Grid } from "@mui/material";
import { ICertificate } from "gateways/exports/ICertificate";
import { INoteResponseData } from "gateways/mappers/INoteResponseData";
import { Environments, IUse } from "../entities/IUse";
import { IOwner } from "entities/IOwner";
import { IEmergencyContact } from "entities/IEmergencyContact";

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
    title: {
      fontWeight: "bold",
    },
  })
);

interface CertificateProps {
  certificate: ICertificate;
}

interface NotesSectionProps {
  notes: INoteResponseData[];
  classes: ClassNameMap<any>;
}

interface UsesSectionProps {
  uses: IUse[];
  classes: ClassNameMap<any>;
}

interface VesselDetailsProps {
  maritimeUse: IUse;
  classes: ClassNameMap<any>;
}

interface OwnersSectionProps {
  owner: IOwner | undefined;
  emergencyContacts: IEmergencyContact[] | undefined;
  classes: ClassNameMap<any>;
}

interface OwnerDetailsProps {
  owner: IOwner | undefined;
  emergencyContacts: IEmergencyContact[] | undefined;
  classes: ClassNameMap<any>;
}

const NotesSection: FunctionComponent<NotesSectionProps> = ({
  notes,
  classes,
}): JSX.Element => {
  return (
    <Grid item xs={6}>
      <div>
        <span className={classes.title}>NOTES:</span>
        {notes.map((note, index) => (
          <span key={note.id}>
            {note.attributes.createdDate}: {note.attributes.text}.
          </span>
        ))}
      </div>
    </Grid>
  );
};

const UsesSection: FunctionComponent<UsesSectionProps> = ({
  uses,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={0.5}>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>BEACON USES:</span>
        </div>
      </Grid>
      {uses.map((use, index) => (
        <Grid item xs={12}>
          <span key={use.id}> {use.environment}</span>
          <VesselDetails maritimeUse={use} classes={classes} />
          <VesselIdentification maritimeUse={use} classes={classes} />
        </Grid>
      ))}
    </Grid>
  );
};

const VesselDetails: FunctionComponent<VesselDetailsProps> = ({
  maritimeUse,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <h3>Vessel Details:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>VESSEL NAME: </span>
          {maritimeUse.vesselName}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>VESSEL: </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>VESSEL CALLSIGN: </span>
          {maritimeUse.callSign}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>RADIO SYSTEM: </span>
          {maritimeUse.fixedVhfRadioValue}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>HOMEPORT: </span>
          {maritimeUse.homeport}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>MAX PERSON ON BOARD: </span>
          {maritimeUse.maxCapacity}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>MMSI NUMBER: </span>
          {maritimeUse.cnOrMsnNumber}
        </div>
      </Grid>
    </Grid>
  );
};

const VesselIdentification: FunctionComponent<VesselDetailsProps> = ({
  maritimeUse,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <h3>Vessel Identification:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>
            FISHING VESSEL PORT ID & NUMBERS:{" "}
          </span>
          {maritimeUse.portLetterNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>OFFICIAL NUMBER: </span>
          {maritimeUse.officialNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>RSS/SSR NUMBER: </span>
          {maritimeUse.rssNumber} / {maritimeUse.ssrNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>
            COASTGUARD CG66 REFERENCE NUMBER:{" "}
          </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>IMO NUMBER: </span>
          {maritimeUse.imoNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>HULL ID NUMBER: </span>
        </div>
      </Grid>
    </Grid>
  );
};

const OwnersSection: FunctionComponent<OwnersSectionProps> = ({
  owner,
  emergencyContacts,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={0.5}>
      <OwnerDetails
        owner={owner}
        emergencyContacts={emergencyContacts}
        classes={classes}
      />
    </Grid>
  );
};

// Owner Details
// how do I know which emergency contact(s) belong to which owner?
const OwnerDetails: FunctionComponent<OwnerDetailsProps> = ({
  owner,
  emergencyContacts,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={0.5}>
      <Grid item xs={12}>
        <h3>Vessel Identification:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>
            FISHING VESSEL PORT ID & NUMBERS:{" "}
          </span>
          {maritimeUse.portLetterNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>OFFICIAL NUMBER: </span>
          {maritimeUse.officialNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>RSS/SSR NUMBER: </span>
          {maritimeUse.rssNumber} / {maritimeUse.ssrNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>
            COASTGUARD CG66 REFERENCE NUMBER:{" "}
          </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>IMO NUMBER: </span>
          {maritimeUse.imoNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>HULL ID NUMBER: </span>
        </div>
      </Grid>
    </Grid>
  );
};

export const Certificate: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  const classes = useStyles();
  const maritimeUses = certificate.uses.filter(
    (use) => use.environment === Environments.Maritime
  );

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.header} container spacing={0.5}>
        <Grid item xl={12}>
          <div>OFFICIAL</div>
          <h3>UK Distress & Security Beacon Registration</h3>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>PROOF OF REGISTRATION:</span>
            {certificate.proofOfRegistrationDate}
          </div>
          <Grid item xs={6}>
            <div>
              <span className={classes.title}>DEPT REF: </span>
              {certificate.beacon.referenceNumber}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={0.5}>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>RECORD CREATED DATE: </span>
            {certificate.beacon.createdDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>BEACON STATUS: </span>
            {certificate.beacon.status}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>LAST MODIFIED: </span>
            {certificate.beacon.lastModifiedDate}
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <h3>Beacon Details:</h3>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>HEX ID: </span>
            {certificate.beacon.hexId}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>MANUFACTURER: </span>
            {certificate.beacon.manufacturer}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>MANUFACTURER SERIAL NO: </span>
            {certificate.beacon.manufacturerSerialNumber}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>BEACON MODEL: </span>
            {certificate.beacon.model}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>BEACON CODING: </span>
            {certificate.beacon.coding}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>CODING PROTOCOL: </span>
            {certificate.beacon.protocol}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>BEACON LAST SERVICED: </span>
            {certificate.beacon.lastServicedDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>BATTERY EXPIRY DATE: </span>
            {certificate.beacon.batteryExpiryDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className={classes.title}>CSTA NUMBER: </span>
            {certificate.beacon.csta}
          </div>
        </Grid>
      </Grid>

      <NotesSection notes={certificate.notes} classes={classes} />

      <UsesSection uses={maritimeUses} classes={classes} />

      <OwnersSection
        owner={certificate.beacon.owner}
        emergencyContacts={certificate.beacon.emergencyContacts}
        classes={classes}
      />
    </Grid>
  );
};
