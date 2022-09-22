import "../certificate.scss";
import React, { FunctionComponent } from "react";
import { Grid } from "@mui/material";
import { ICertificate } from "gateways/exports/ICertificate";
import { INoteResponseData } from "gateways/mappers/INoteResponseData";
import { Environments, IUse } from "../entities/IUse";
import { IOwner } from "entities/IOwner";
import { IEmergencyContact } from "entities/IEmergencyContact";

interface CertificateProps {
  certificate: ICertificate;
}

interface NotesSectionProps {
  notes: INoteResponseData[];
}

interface UsesSectionProps {
  uses: IUse[];
}

interface VesselDetailsProps {
  maritimeUse: IUse;
}

interface OwnerDetailsProps {
  owner: IOwner;
  emergencyContacts: IEmergencyContact[] | undefined;
}

interface EmergencyContactsSectionProps {
  emergencyContacts: IEmergencyContact[] | undefined;
}

const NotesSection: FunctionComponent<NotesSectionProps> = ({
  notes,
}): JSX.Element => {
  return (
    <Grid item xs={6}>
      <div>
        <span className="title">NOTES:</span>
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
}): JSX.Element => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <div>
          <span className="title">BEACON USES:</span>
        </div>
      </Grid>
      {uses.map((use, index) => (
        <Grid item xs={12}>
          <span key={use.id}> {use.environment}</span>
          <VesselDetails maritimeUse={use} />
          <VesselIdentification maritimeUse={use} />
        </Grid>
      ))}
    </Grid>
  );
};

const VesselDetails: FunctionComponent<VesselDetailsProps> = ({
  maritimeUse,
}): JSX.Element => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h3>Vessel Details:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">VESSEL NAME: </span>
          {maritimeUse.vesselName}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">HOMEPORT: </span>
          {maritimeUse.homeport}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">VESSEL CALLSIGN: </span>
          {maritimeUse.callSign}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">MMSI NUMBER: </span>
          {maritimeUse.cnOrMsnNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">VESSEL: </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">MAX PERSON ON BOARD: </span>
          {maritimeUse.maxCapacity}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          {/* // getVesselCommunicationsFields */}
          <span className="title">RADIO SYSTEM: </span>
          {maritimeUse.fixedVhfRadioValue}
        </div>
      </Grid>
    </Grid>
  );
};

const VesselIdentification: FunctionComponent<VesselDetailsProps> = ({
  maritimeUse,
}): JSX.Element => {
  let rssOrSsrValue =
    (maritimeUse.rssNumber = maritimeUse.rssNumber
      ? maritimeUse.rssNumber
      : "") +
    "/" +
    (maritimeUse.ssrNumber = maritimeUse.ssrNumber
      ? maritimeUse.ssrNumber
      : "");
  rssOrSsrValue =
    maritimeUse.rssNumber && maritimeUse.ssrNumber
      ? rssOrSsrValue
      : rssOrSsrValue.replace("/", "");

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h3>Vessel Identification:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">FISHING VESSEL PORT ID & NUMBERS: </span>
          {maritimeUse.portLetterNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">OFFICIAL NUMBER: </span>
          {maritimeUse.officialNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">RSS/SSR NUMBER: </span>
          {rssOrSsrValue}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">COASTGUARD CG66 REFERENCE NUMBER: </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">IMO NUMBER: </span>
          {maritimeUse.imoNumber}
        </div>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">HULL ID NUMBER: </span>
        </div>
      </Grid>
    </Grid>
  );
};

const OwnerDetails: FunctionComponent<OwnerDetailsProps> = ({
  owner,
  emergencyContacts,
}): JSX.Element => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h3>Owner Details:</h3>
      </Grid>
      <Grid item xs={6}>
        <div>
          <span className="title">OWNER(S):</span>
          {owner.fullName}
        </div>
        <div>
          <span className="title">COMPANY AGENT: </span>
        </div>
        <div>
          <span className="title">CARE OF: </span>
        </div>
        <div>
          <span className="title">ADDRESS: </span>
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
          <span className="title">COUNTRY: </span>
          {owner.country}
        </div>
        <div>
          <span className="title">TELs: </span>
          <p>{owner.telephoneNumber}</p>
          <p>{owner.alternativeTelephoneNumber}</p>
        </div>
        <div>
          <span className="title">MOBILES: </span>
        </div>
        <div>
          <span className="title">OTHER/EMAIL: </span>
          {owner.email}
        </div>
        <EmergencyContactsSection emergencyContacts={emergencyContacts} />
      </Grid>
    </Grid>
  );
};

const EmergencyContactsSection: FunctionComponent<
  EmergencyContactsSectionProps
> = ({ emergencyContacts }): JSX.Element => {
  if (emergencyContacts) {
    return (
      <Grid item xs={6}>
        <div>
          <span className="title">EMERGENCY CONTACTS:</span>
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
          <span className="title">EMERGENCY CONTACTS:</span>
        </div>
      </Grid>
    );
  }
};

export const Certificate: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  const maritimeUses = certificate.uses.filter(
    (use) => use.environment === Environments.Maritime
  );

  return (
    <Grid container className="root">
      <Grid className="header" container spacing={0.5}>
        <Grid item xl={8}>
          <div>OFFICIAL</div>
          <h3>UK Distress & Security Beacon Registration</h3>
        </Grid>
        {/* resize grid item for print screen size
          what should it be when it's medium/small        
        */}
        <Grid className="logoContainer" item xs={2}>
          <img
            src={process.env.PUBLIC_URL + "/mca-logo.png"}
            alt="mca logo"
            className="mcaLogo"
          />
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">PROOF OF REGISTRATION: </span>
            {certificate.proofOfRegistrationDate}
          </div>
        </Grid>
        <Grid item xs={4}>
          <span className="title"> DEPT REF: </span>
          {certificate.beacon.referenceNumber}
        </Grid>
      </Grid>

      <Grid className="beaconInfo" container spacing={1}>
        <Grid item xs={6}>
          <div>
            <span className="title">RECORD CREATED DATE: </span>
            {certificate.beaconCreatedDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">LAST MODIFIED: </span>
            {certificate.proofOfRegistrationDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">BEACON STATUS: </span>
            {certificate.beacon.status}
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h3>Beacon Details:</h3>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">HEX ID: </span>
            {certificate.beacon.hexId}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">MANUFACTURER SERIAL NO: </span>
            {certificate.beacon.manufacturerSerialNumber}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">MANUFACTURER: </span>
            {certificate.beacon.manufacturer}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">BEACON MODEL: </span>
            {certificate.beacon.model}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">BEACON CODING: </span>
            {certificate.beacon.coding}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">CODING PROTOCOL: </span>
            {certificate.beacon.protocol}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">BEACON LAST SERVICED: </span>
            {certificate.beacon.lastServicedDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">BATTERY EXPIRY DATE: </span>
            {certificate.beacon.batteryExpiryDate}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <span className="title">CSTA NUMBER: </span>
            {certificate.beacon.csta}
          </div>
        </Grid>
      </Grid>

      <NotesSection notes={certificate.notes} />

      <UsesSection uses={maritimeUses} />

      <OwnerDetails
        owner={certificate.owner as IOwner}
        emergencyContacts={certificate.emergencyContacts}
      />

      <Grid className="footer" container spacing={1}>
        <Grid item xl={12}>
          <div>
            <span className="title">
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
              <a className="link" href="mailto:UKBeacons@mcga.gov.uk">
                UKBeacons@mcga.gov.uk{" "}
              </a>
              <a className="link" href="http://www.gov.uk/406beacon">
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
