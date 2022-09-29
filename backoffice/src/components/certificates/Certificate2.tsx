import "./certificate2.scss";
import { FunctionComponent } from "react";
import { ICertificate } from "gateways/exports/ICertificate";
import { INoteResponseData } from "gateways/mappers/INoteResponseData";
import { Environments, IUse } from "../../entities/IUse";
import { IOwner } from "entities/IOwner";
import { IEmergencyContact } from "entities/IEmergencyContact";
import { getVesselCommunicationsFields } from "../../utils/utils";
import { IField } from "../../utils/IField";
import { customDateStringFormat } from "../../utils/dateTime";
import { IRegistrationResponse } from "gateways/mappers/IRegistrationResponse";

interface CertificateProps {
  certificate: ICertificate;
}

interface CertificateFieldProps {
  classes: string;
  title: string;
  value: any;
}

interface NotesSectionProps {
  notes: INoteResponseData[];
}

interface UsesSectionProps {
  uses: IUse[];
}

interface UseSectionProps {
  use: IUse;
  index: number;
}

interface RegistrationProps {
  registration: IRegistrationResponse;
}

interface OwnerDetailsProps {
  owner: IOwner;
}

interface EmergencyContactsSectionProps {
  emergencyContacts: IEmergencyContact[];
}

export const Certificate: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  return (
    <div className="certificate">
      {/* <div className="certificate" onLoad={window.print}> */}
      <CertificateHeader certificate={certificate} />

      <div className="content">
        <div className="section">
          <CertificateField
            classes="half"
            title="Record Created Date"
            value={customDateStringFormat(
              certificate.beacon.createdDate,
              "DD MMMM yyyy"
            )}
          />
          <CertificateField
            classes="half"
            title="Last Modified"
            value={customDateStringFormat(
              certificate.beacon.lastModifiedDate,
              "DD MMMM yyyy"
            )}
          />
          <CertificateField
            classes="full"
            title="Beacon Status"
            value={certificate.beacon.status}
          />
        </div>

        <RegistrationSection registration={certificate.beacon} />
        <NotesSection notes={certificate.notes} />

        <UsesSection uses={certificate.uses} />

        <OwnerDetails owner={certificate.owner as IOwner} />

        <EmergencyContactsSection
          emergencyContacts={certificate.emergencyContacts}
        />
      </div>
      <CertificateFooter />
    </div>
  );
};

function CertificateField({ classes, title, value }: CertificateFieldProps) {
  return (
    <div className={classes + " field"}>
      <span className="title">{title}: </span>
      <span>{value}</span>
    </div>
  );
}

const CertificateHeader: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  return (
    <div className="header full">
      <div className="content">
        <div>OFFICIAL</div>
        <h3>UK Distress & Security Beacon Registration</h3>

        <CertificateField
          classes="half"
          title="Proof Of Registration"
          value={customDateStringFormat(
            certificate.beacon.createdDate,
            "DD MMMM yyyy"
          )}
        />
        <CertificateField
          classes="half"
          title="Dept Ref"
          value={certificate.beacon.referenceNumber}
        />
      </div>
      <div className="logo">
        <img
          src={process.env.PUBLIC_URL + "/mca-logo.png"}
          alt="Maritime &amp; Coastguard Agency"
          className="mcaLogo"
        />
      </div>
    </div>
  );
};

const RegistrationSection = ({
  registration,
}: RegistrationProps): JSX.Element => {
  const beacon = registration;
  return (
    <div className="section">
      <h3>Beacon Details:</h3>

      <CertificateField classes="full" title="Hex Id" value={beacon.hexId} />
      <CertificateField
        classes="half"
        title="Manufacturer"
        value={beacon.manufacturer}
      />
      {/* ToDO - Wrong value. */}
      <CertificateField
        classes="half"
        title="SERIAL NO"
        value={beacon.manufacturerSerialNumber}
      />
      <CertificateField
        classes="full"
        title="Manufacturer Serial No"
        value={beacon.manufacturerSerialNumber}
      />
      <CertificateField
        classes="half"
        title="Beacon Model"
        value={beacon.manufacturerSerialNumber}
      />
      <CertificateField
        classes="half"
        title="Beacon Last Serviced"
        value={beacon.lastServicedDate}
      />
      <CertificateField
        classes="half"
        title="Beacon Coding"
        value={beacon.coding}
      />
      <CertificateField
        classes="half"
        title="Beacon Expiry Date"
        value={customDateStringFormat(beacon.batteryExpiryDate, "MMMM yyyy")}
      />
      <CertificateField
        classes="half"
        title="Coding Protocol"
        value={beacon.protocol}
      />
      <CertificateField
        classes="half"
        title="Csta Number"
        value={beacon.csta}
      />
    </div>
  );
};
const NotesSection: FunctionComponent<NotesSectionProps> = ({
  notes,
}): JSX.Element => {
  return (
    <div className="section">
      <span className="title">NOTES:</span>
      {notes.map((note) => (
        <span className="note">
          | {customDateStringFormat(note.attributes.createdDate, "DD/MM/yyyy")}:{" "}
          {note.attributes.text}
        </span>
      ))}
    </div>
  );
};

const UsesSection: FunctionComponent<UsesSectionProps> = ({
  uses,
}): JSX.Element => {
  return (
    <div className="section">
      <span className="title">BEACON USES:</span>

      {uses.map((use, index) => (
        <UseSection use={use} index={index + 1} />
      ))}
    </div>
  );
};

const UseSection: FunctionComponent<UseSectionProps> = ({
  use,
  index,
}: UseSectionProps): JSX.Element => {
  switch (use.environment) {
    case Environments.Maritime:
      return <MaritimeUse use={use} index={index} />;
    case Environments.Aviation:
      return <AviationUse use={use} index={index} />;
    case Environments.Land:
      return <LandUse use={use} index={index} />;
    default:
      return <LandUse use={use} index={index} />;
  }
};

const MaritimeUse: FunctionComponent<UseSectionProps> = ({
  use,
  index,
}: UseSectionProps): JSX.Element => {
  const communicationFields: IField[] = getVesselCommunicationsFields(
    use
  ).filter((field) => field.key?.includes("Communication"));

  return (
    <div className="use full">
      <h4 className="title use"> {use.environment + ` (${index})`}</h4>
      <div className="section">
        <h3>Vessel Details:</h3>

        <CertificateField
          classes="half"
          title="Vessel Name"
          value={use.vesselName}
        />
        <CertificateField
          classes="half"
          title="Homeport"
          value={use.homeport}
        />
        <CertificateField classes="half" title="Vessel" value={"TODO"} />
        <CertificateField
          classes="half"
          title="Max Person On Board"
          value={use.maxCapacity}
        />
        <CertificateField
          classes="half"
          title="Vessel Callsign"
          value={use.callSign}
        />
        <CertificateField
          classes="half"
          title="MMSI Number"
          value={use.fixedVhfRadioValue}
        />
        <CertificateField classes="full" title="Radio System" value={"TODO"} />

        {/* <div className="subItem">
            <span className="title">RADIO SYSTEM(S): </span>
            {communicationFields.map((field) => (
              <span key={field.key}>
                <div>
                  {field.key}: {field.value}
                </div>
              </span>
            ))}
          </div> */}
      </div>

      <div className="section">
        <h3>Vessel Identification:</h3>
        <CertificateField
          classes="full"
          title="Fishing Vessel Port ID &amp; Numbers"
          value={use.portLetterNumber}
        />
        <CertificateField
          classes="half"
          title="Official Number"
          value={use.officialNumber}
        />
        <CertificateField
          classes="half"
          title="IMO Number"
          value={use.imoNumber}
        />
        <CertificateField
          classes="half"
          title="RSS/SSR Number"
          value={`${use.rssNumber || "N/A"} / ${use.ssrNumber || "N/A"}`}
        />
        <CertificateField
          classes="half"
          title="Hull ID Number"
          value={"TODO"}
        />
        <CertificateField
          classes="full"
          title="Coastguard CG66 Reference Number"
          value={"TODO"}
        />
      </div>
    </div>
  );
};

const AviationUse: FunctionComponent<UseSectionProps> = ({
  use,
  index,
}: UseSectionProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use"> {use.environment + ` (${index})`}</h4>
      <div className="section">
        <h3>Aircraft Details:</h3>

        <CertificateField classes="half" title="Aircraft Type" value={"TODO"} />
        <CertificateField
          classes="half"
          title="Max Person On Board"
          value={use.maxCapacity}
        />
        <CertificateField
          classes="full"
          title="Aircraft Registration Mark"
          value={"TODO"}
        />
        <CertificateField
          classes="full"
          title="24-Bit Address In Hex"
          value={"TODO"}
        />
        <CertificateField
          classes="full"
          title="Principal Airport"
          value={use.principalAirport}
        />
        <CertificateField classes="full" title="Radio System" value={"TODO"} />
        <CertificateField
          classes="full"
          title="Aircraft Operators Designator (AOD) &amp; Serial No"
          value={"TODO"}
        />
        {/* <div className="subItem">
            <span className="title">RADIO SYSTEM(S): </span>
            {communicationFields.map((field) => (
              <span key={field.key}>
                <div>
                  {field.key}: {field.value}
                </div>
              </span>
            ))}
          </div> */}
      </div>
    </div>
  );
};

const LandUse: FunctionComponent<UseSectionProps> = ({
  use,
  index,
}: UseSectionProps): JSX.Element => {
  return (
    <div className="use full">
      <h5 className="title use"> {use.environment + ` (${index})`}</h5>
      <div className="section">
        <h3>Land Details:</h3>

        <CertificateField
          classes="full"
          title="Description Of Intended Use"
          value={"TODO"}
        />
        <CertificateField
          classes="full"
          title="Number Of Persons On Board"
          value={use.maxCapacity}
        />
        <CertificateField classes="full" title="Area Of Use" value={"TODO"} />
        <CertificateField
          classes="full"
          title="Current/Future Trip Information"
          value={"TODO"}
        />
        <CertificateField classes="full" title="Radio System" value={"TODO"} />
        {/* <div className="subItem">
              <span className="title">RADIO SYSTEM(S): </span>
              {communicationFields.map((field) => (
                <span key={field.key}>
                  <div>
                    {field.key}: {field.value}
                  </div>
                </span>
              ))}
            </div> */}
      </div>
    </div>
  );
};

const OwnerDetails: FunctionComponent<OwnerDetailsProps> = ({
  owner,
}): JSX.Element => {
  return (
    <div className="section">
      <h3>Owner Details:</h3>
      {/* This value seems wrong. */}
      <CertificateField
        classes="full"
        title="Owner(s)"
        value={owner.fullName}
      />
      <CertificateField classes="half" title="Company Agent" value={"TODO"} />
      <CertificateField classes="half" title="Care Of" value={"TODO"} />

      <div className="half address">
        <span className="title">Address: </span>
        <div className="address-fields">
          {[
            owner.addressLine1,
            owner.addressLine2,
            owner.addressLine3,
            owner.addressLine4,
            owner.townOrCity,
            owner.county,
            owner.postcode,
          ].map((line) => (
            <span>{line}</span>
          ))}
        </div>
      </div>
      <CertificateField classes="half" title="Country" value={owner.country} />
      <CertificateField
        classes="half"
        title="Tels"
        value={`${owner.telephoneNumber} / ${owner.alternativeTelephoneNumber}`}
      />
      <CertificateField classes="half" title="Mobiles" value={"TODO"} />
      <CertificateField classes="half" title="Email" value={owner.email} />
    </div>
  );
};

const EmergencyContactsSection: FunctionComponent<
  EmergencyContactsSectionProps
> = ({ emergencyContacts }): JSX.Element => {
  const hasEmergencyContacts =
    emergencyContacts != null && emergencyContacts.length > 0;
  return (
    <div className="section">
      <span className="title">EMERGENCY CONTACTS:</span>
      {hasEmergencyContacts &&
        emergencyContacts.map((ec) => {
          <CertificateField
            classes="full"
            title={ec.fullName}
            value={`${ec.telephoneNumber} / ${ec.alternativeTelephoneNumber}`}
          />;
        })}
    </div>
  );
};

const CertificateFooter: FunctionComponent = (): JSX.Element => {
  return (
    <div className="footer full">
      <div className="text">
        <span className="bold">
          In an Emergency, call Falmouth Coastguard, 24 hour Tel: +44 (0)1326
          317575
        </span>
        <span>
          Proof of Registration from The UK Distress and Security Beacon
          Registry
        </span>
        <span>
          Falmouth MRCC, Castle Drive, Pendennis Point, Falmouth, Cornwall TR11
          4WZ
        </span>
        <span>
          Office Hours Tel: +44 (0)1326 211569 Fax: +44 (0)1326 319264
        </span>
        <span>
          Email:
          <a className="link" href="mailto:UKBeacons@mcga.gov.uk">
            UKBeacons@mcga.gov.uk
          </a>
          <a className="link" href="https://www.gov.uk/register-406-beacons">
            https://www.gov.uk/register-406-beacons
          </a>
        </span>
      </div>
      <p>OFFICIAL</p>
    </div>
  );
};
