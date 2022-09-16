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
      borderBottom: "2px solid black",
      paddingBottom: "0.5%",
    },
    mcaLogo: {
      height: "100px",
      float: "right",
      paddingRight: "15%",
      transformOrigin: "0% 0% 0% 60%",
    },
    title: {
      fontWeight: "bold",
    },
    beaconInfo: {
      paddingTop: "0.5%",
    },
    link: {
      textDecoration: "none",
      color: "blue",
    },
    footer: {
      marginTop: "50%",
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

interface OwnerDetailsProps {
  owner: IOwner;
  emergencyContacts: IEmergencyContact[] | undefined;
  classes: ClassNameMap<any>;
}

interface EmergencyContactsSectionProps {
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
    <Grid container spacing={1}>
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
    <Grid container spacing={1}>
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
    <Grid container spacing={1}>
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

const OwnerDetails: FunctionComponent<OwnerDetailsProps> = ({
  owner,
  emergencyContacts,
  classes,
}): JSX.Element => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h3>Owner Details:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>OWNER(S):</span>
          {owner.fullName}
        </div>
        <div>
          <span className={classes.title}>COMPANY AGENT: </span>
        </div>
        <div>
          <span className={classes.title}>CARE OF: </span>
        </div>
        <div>
          <span className={classes.title}>ADDRESS: </span>
          <p>
            {owner.addressLine1} <br />
            {owner.addressLine2} <br />
            {owner.addressLine3} <br />
            {owner.addressLine4} <br />
            {owner.townOrCity} <br />
            {owner.county} <br />
            {owner.postcode} <br />
          </p>
        </div>
        <div>
          <span className={classes.title}>COUNTRY: </span>
          {owner.country}
        </div>
        <div>
          <span className={classes.title}>TELs: </span>
          <p>{owner.telephoneNumber}</p>
          <p>{owner.alternativeTelephoneNumber}</p>
        </div>
        <div>
          <span className={classes.title}>MOBILES: </span>
          {/* check for mobile numbers and put them here in a const */}
        </div>
        <div>
          <span className={classes.title}>OTHER/EMAIL: </span>
          {owner.email}
        </div>
        <EmergencyContactsSection
          emergencyContacts={emergencyContacts}
          classes={classes}
        />
      </Grid>
    </Grid>
  );
};

const EmergencyContactsSection: FunctionComponent<
  EmergencyContactsSectionProps
> = ({ emergencyContacts, classes }): JSX.Element => {
  if (emergencyContacts) {
    return (
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>EMERGENCY CONTACTS:</span>
          {emergencyContacts.map((emergencyContact, index) => (
            <span>
              <div key={emergencyContact.id}>
                {emergencyContact.fullName}: {emergencyContact.telephoneNumber};{" "}
                {emergencyContact.alternativeTelephoneNumber}.
              </div>
            </span>
          ))}
        </div>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={6}>
        <div>
          <span className={classes.title}>EMERGENCY CONTACTS:</span>
        </div>
      </Grid>
    );
  }
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
        <Grid item xs={8}>
          <div>
            <span className={classes.title}>PROOF OF REGISTRATION: </span>
            {certificate.proofOfRegistrationDate}
          </div>
        </Grid>
        <Grid item xs={4}>
          <span className={classes.title}> DEPT REF: </span>
          {certificate.beacon.referenceNumber}845775
          <img
            src={process.env.PUBLIC_URL + "/mca-logo.png"}
            alt="mca logo"
            className={classes.mcaLogo}
          />
        </Grid>
        {/* <Grid item xs={2}>

          </Grid> */}
      </Grid>

      <Grid className={classes.beaconInfo} container spacing={1}>
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

      <Grid container spacing={1}>
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

      <OwnerDetails
        owner={certificate.owner as IOwner}
        emergencyContacts={certificate.emergencyContacts}
        classes={classes}
      />

      <Grid className={classes.footer} container spacing={1}>
        <Grid item xl={12}>
          <div>
            <span className={classes.title}>
              In an Emergency, call Falmouth Coastguard, 24 hour Tel: +44
              (0)1326 317575
            </span>
            <p>
              Proof of Registration from The UK Distress and Security Beacon
              Registry
              <br />
              Falmouth MRCC, Castle Drive, Pendennis Point, Falmouth, Cornwall
              TR11 4WZ
              <br />
              Office Hours Tel: +44 (0)1326 211569 Fax: +44 (0)1326 319264
              <br />
              Email:
              <a className={classes.link} href="mailto:UKBeacons@mcga.gov.uk">
                UKBeacons@mcga.gov.uk{" "}
              </a>
              <a className={classes.link} href="http://www.gov.uk/406beacon">
                {" "}
                http://www.gov.uk/406beacon
              </a>
            </p>
          </div>
          <div>OFFICIAL</div>
        </Grid>
      </Grid>
    </Grid>
  );
};
