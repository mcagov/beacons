import "./certificate.scss";
import { FunctionComponent } from "react";
import { customDateStringFormat } from "utils/dateTime";
import {
  CertificateHeader,
  CertificateFooter,
  CertificateField,
  BeaconExportProps,
  UseProps,
  GenericUse,
} from "./BaseCertificate";
import { Environments } from "../../../entities/IUse";

export const LegacyCertificate: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="certificate">
      {/* <div className="certificate" onLoad={window.print}> */}
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

        <BeaconSection beacon={beacon} />

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

      <CertificateField classes="full" title="Hex Id" value={beacon.hexId} />
      <CertificateField
        classes="half"
        title="Manufacturer"
        value={beacon.manufacturer}
      />
      <CertificateField
        classes="half"
        title="SERIAL NO"
        value={beacon.serialNumber}
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
        value={customDateStringFormat(beacon.beaconlastServiced, "MMMM yyyy")}
      />
      <CertificateField
        classes="half"
        title="Beacon Coding"
        value={beacon.beaconCoding}
      />
      <CertificateField
        classes="half"
        title="Beacon Expiry Date"
        value={customDateStringFormat(beacon.batteryExpiryDate, "MMMM yyyy")}
      />
      <CertificateField
        classes="half"
        title="Coding Protocol"
        value={beacon.codingProtocol}
      />
      <CertificateField
        classes="half"
        title="Csta Number"
        value={beacon.cstaNumber}
      />
    </div>
  );
};

const UsesSection: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="section">
      <span className="title">BEACON USES:</span>

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
      return <GenericUse use={use} index={index} />;
  }
};

const MaritimeUse: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
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
          value={use.homePort}
        />
        <CertificateField classes="half" title="Vessel" value={use.vessel} />
        <CertificateField
          classes="half"
          title="Max Person On Board"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="half"
          title="Vessel Callsign"
          value={use.vesselCallsign}
        />
        <CertificateField
          classes="half"
          title="MMSI Number"
          value={use.mmsiNumber}
        />
        <CertificateField
          classes="full"
          title="Radio System"
          value={use.radioSystem}
        />
      </div>

      <div className="section">
        <h3>Vessel Identification:</h3>
        <CertificateField
          classes="full"
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
          title="Hull ID Number"
          value={use.hullIdNumber}
        />
        <CertificateField
          classes="full"
          title="Coastguard CG66 Reference Number"
          value={use.coastguardCGRefNumber}
        />

        <CertificateField classes="full" title="Notes" value={use.notes} />
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
      <h4 className="title use"> {use.environment + ` (${index})`}</h4>
      <div className="section">
        <h3>Aircraft Details:</h3>

        <CertificateField
          classes="half"
          title="Aircraft Type"
          value={use.aircraftType}
        />
        <CertificateField
          classes="half"
          title="Max Person On Board"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="full"
          title="Aircraft Registration Mark"
          value={use.aircraftRegistrationMark}
        />
        <CertificateField
          classes="full"
          title="24-Bit Address In Hex"
          value={use.TwentyFourBitAddressInHex}
        />
        <CertificateField
          classes="full"
          title="Principal Airport"
          value={use.principalAirport}
        />
        <CertificateField
          classes="full"
          title="Radio System"
          value={use.radioSystem}
        />
        <CertificateField classes="full" title="Notes" value={use.notes} />
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
      <h4 className="title use"> {use.environment + ` (${index})`}</h4>
      <div className="section">
        <h3>Land Details:</h3>

        <CertificateField
          classes="full"
          title="Description Of Intended Use"
          value={use.descriptionOfIntendedUse}
        />
        <CertificateField
          classes="full"
          title="Number Of Persons On Board"
          value={use.maxPersonOnBoard}
        />
        <CertificateField
          classes="full"
          title="Area Of Use"
          value={use.areaOfUse}
        />
        <CertificateField
          classes="full"
          title="Current/Future Trip Information"
          value={use.tripInformation}
        />
        <CertificateField
          classes="full"
          title="Radio System"
          value={use.radioSystem}
        />
        <CertificateField classes="full" title="Notes" value={use.notes} />
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
              classes="half"
              title="Company Agent"
              value={owner.companyAgent}
            />
            <CertificateField
              classes="half"
              title="Care Of"
              value={owner.careOf}
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
                ].map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </div>
            </div>
            <CertificateField
              classes="half"
              title="Country"
              value={owner.country}
            />
            <CertificateField
              classes="half"
              title="Tels"
              value={owner.telephoneNumbers}
            />
            <CertificateField
              classes="half"
              title="Mobiles"
              value={owner.mobiles}
            />
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
  return (
    <div className="section">
      <span className="title">EMERGENCY CONTACTS: {}</span>
      {beacon.emergencyContacts &&
        beacon.emergencyContacts.map((ec, index) => (
          <CertificateField
            classes="full"
            title={`${index + 1}`}
            value={ec.fullName}
            key={index}
          />
        ))}
    </div>
  );
};
