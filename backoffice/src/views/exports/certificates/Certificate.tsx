import "./certificate.scss";
import { FunctionComponent } from "react";
import { customDateStringFormat } from "utils/dateTime";
import {
  CertificateHeader,
  CertificateFooter,
  CertificateField,
  BeaconExportProps,
  UseProps,
} from "./BaseCertificate";
import { Environments } from "../../../entities/IUse";

export const Certificate: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="certificate">
      <CertificateHeader beacon={beacon} />

      <div className="content">
        <div className="section">
          <CertificateField
            classes="half"
            title="Record Created Date"
            value={customDateStringFormat(
              beacon.recordCreatedDate,
              "DD MMMM yyyy"
            )}
          />
          <CertificateField
            classes="half"
            title="Last Modified"
            value={customDateStringFormat(
              beacon.lastModifiedDate,
              "DD MMMM yyyy"
            )}
          />
          <CertificateField
            classes="full"
            title="Beacon Status"
            value={beacon.beaconStatus}
          />
        </div>

        <AccountHolderSection beacon={beacon} />

        <BeaconSection beacon={beacon} />

        <NotesSection beacon={beacon} />

        <UsesSection beacon={beacon} />

        <OwnersSection beacon={beacon} />

        <EmergencyContactsSection beacon={beacon} />
      </div>
      <CertificateFooter />
    </div>
  );
};

const BeaconSection = ({ beacon }: BeaconExportProps): JSX.Element => {
  return (
    <div className="section">
      <h3>Beacon Details:</h3>

      <CertificateField
        classes="full bold"
        title="Hex Id"
        value={beacon.hexId}
      />
      <CertificateField
        classes="half"
        title="Manufacturer"
        value={beacon.manufacturer}
      />
      <CertificateField
        classes="full"
        title="Manufacturer Serial No"
        value={beacon.manufacturerSerialNumber}
      />
      <CertificateField
        classes="half"
        title="Beacon Model"
        value={beacon.beaconModel}
      />
      <CertificateField
        classes="half"
        title="Beacon Last Serviced"
        value={customDateStringFormat(beacon.beaconlastServiced, "DD/MM/yyyy")}
      />
      <CertificateField
        classes="half"
        title="Beacon Coding"
        value={beacon.beaconCoding}
      />
      <CertificateField
        classes="half"
        title="Battery Expiry Date"
        value={customDateStringFormat(beacon.batteryExpiryDate, "DD/MM/yyyy")}
      />
      <CertificateField
        classes="full"
        title="Coding Protocol"
        value={beacon.codingProtocol}
      />
      <CertificateField
        classes="half"
        title="Csta Number"
        value={beacon.cstaNumber}
      />
      <CertificateField
        classes="half"
        title="CHK Code"
        value={beacon.chkCode}
      />
    </div>
  );
};
const NotesSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="section beacon-notes">
      <span className="title">NOTES: </span>
      {beacon.notes &&
        beacon.notes.map((note, index) => (
          <span className="note" key={index}>
            {customDateStringFormat(note.date, "DD/MM/yyyy")}: {note.note}
          </span>
        ))}
    </div>
  );
};

const UsesSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="section">
      {beacon.uses &&
        beacon.uses.map((use, index) => (
          <UseSection use={use} index={index + 1} key={index} />
        ))}
    </div>
  );
};

const UseSection: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
  switch (use.environment) {
    case Environments.Maritime:
      return <MaritimeUse use={use} index={index} />;
    case Environments.Aviation:
      return <AviationUse use={use} index={index} />;
    case Environments.Land:
      return <LandUse use={use} index={index} />;
    default:
      return <div>Unknown Use</div>;
  }
};

const MaritimeUse: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use - ${use.environment} (${use.typeOfUse})`}
      </h4>
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
          value={use.homePort}
        />

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        {use.windfarmLocation && (
          <CertificateField
            classes="half"
            title="Windfarm Location"
            value={use.windfarmLocation}
          />
        )}

        {use.rigPlatformLocation && (
          <CertificateField
            classes="half"
            title="Windfarm Location"
            value={use.windfarmLocation}
          />
        )}

        <CertificateField
          classes="half"
          title="Max Persons Onboard"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="full"
          title="Communications"
          value={Object.keys(use.radioSystems)}
        />
        <CertificateField
          classes="half"
          title="Vessel Call Sign"
          value={use.vesselCallsign}
        />
        <CertificateField
          classes="half"
          title="MMSI Number"
          value={use.mmsiNumber}
        />
        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="half"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
        <br />

        <CertificateField
          classes="half"
          title="Fishing Vessel Port ID &amp; Numbers"
          value={use.fishingVesselPortIdAndNumbers}
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
          value={use.rssAndSsrNumber}
        />
        <CertificateField
          classes="half"
          title="Area Of Operation"
          value={use.areaOfOperation}
        />
        <CertificateField
          classes="full"
          title="More Details"
          value={use.notes}
        />
      </div>
    </div>
  );
};

const AviationUse: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use - ${use.environment} (${use.typeOfUse})`}
      </h4>
      <div className="section">
        <h3>Aircraft Details:</h3>

        <CertificateField
          classes="half"
          title="Aircraft Type"
          value={use.aircraftType}
        />

        <CertificateField
          classes="half"
          title="Aircraft Manufacturer & Model"
          value={use.aircraftManufacturer}
        />

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Max Persons Onboard"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="half"
          title="Aircraft Registration Mark"
          value={use.aircraftRegistrationMark}
        />
        <CertificateField
          classes="half"
          title="24-Bit Address In Hex"
          value={use.twentyFourBitAddressInHex}
        />
        <CertificateField
          classes="half"
          title="Principal Airport"
          value={use.principalAirport}
        />

        <CertificateField
          classes="half"
          title="Secondary Airport"
          value={use.secondaryAirport}
        />
        <CertificateField
          classes="half"
          title="Is This A Dongle?"
          value={use.isDongle}
        />
        <CertificateField
          classes="full"
          title="Communications"
          value={Object.keys(use.radioSystems)}
        />
        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="half"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
        <CertificateField
          classes="full"
          title="More Details"
          value={use.notes}
        />
      </div>
    </div>
  );
};

const LandUse: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use - ${use.environment} (${use.typeOfUse})`}
      </h4>
      <div className="section">
        <h3>Land Details:</h3>

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        {use.windfarmLocation && (
          <CertificateField
            classes="half"
            title="Windfarm Location"
            value={use.windfarmLocation}
          />
        )}

        {use.rigPlatformLocation && (
          <CertificateField
            classes="half"
            title="Windfarm Location"
            value={use.windfarmLocation}
          />
        )}

        <CertificateField
          classes="full"
          title="Description Of Intended Use"
          value={use.descriptionOfIntendedUse}
        />
        <CertificateField
          classes="full"
          title="People Count"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="full"
          title="Area Of Use"
          value={use.areaOfUse}
        />

        <CertificateField
          classes="full"
          title="Communications"
          value={Object.keys(use.radioSystems)}
        />
        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="half"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
        <CertificateField
          classes="full"
          title="More Details"
          value={use.notes}
        />
      </div>
    </div>
  );
};

const AccountHolderSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  const ah = beacon.accountHolder;

  return (
    <div className="account-holder-details">
      <div className="section">
        <h3>Account Holder:</h3>
        <CertificateField classes="half" title="Name" value={ah.fullName} />

        <CertificateField classes="half" title="Email" value={ah.email} />
      </div>
    </div>
  );
};

const OwnersSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="owner-details">
      {beacon.owners &&
        beacon.owners.map((owner, index) => (
          <div className="section" key={index}>
            <h3>Owner Details:</h3>
            <CertificateField
              classes="full"
              title="Owner(s)"
              value={owner.ownerName}
            />
            <CertificateField
              classes="full"
              title="Tels"
              value={owner.telephoneNumbers}
            />
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
                  owner.country,
                ].map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </div>
            </div>

            <CertificateField
              classes="half"
              title="Email"
              value={owner.email}
            />
          </div>
        ))}
    </div>
  );
};

const EmergencyContactsSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  const emergencyContacts = beacon.emergencyContacts;
  const hasEmergencyContacts =
    emergencyContacts != null && emergencyContacts.length > 0;
  return (
    <div className="section emergency-contacts">
      <span className="title">EMERGENCY CONTACTS: </span>
      {hasEmergencyContacts &&
        emergencyContacts.map((ec, index) => (
          <div key={index} className={"full field"}>
            <span>{ec.fullName}: </span>
            <span>{ec.telephoneNumber}</span>
          </div>
        ))}
    </div>
  );
};
