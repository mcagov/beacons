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

export const LegacyCertificate: FunctionComponent<BeaconExportProps> = ({
  beacon,
}): JSX.Element => {
  return (
    <div className="certificate">
      <CertificateHeader beacon={beacon} />

      <div className="content">
        <div className="section">
          <CertificateField
            classes="half"
            title="First Registration Date"
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
        classes="half"
        title="SERIAL NO"
        value={beacon.serialNumber > 0 ? beacon.serialNumber : ""}
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
      {beacon.cospasSarsatNumber && (
        <CertificateField
          classes="half"
          title="Cospas Sarsat Serial Number"
          value={beacon.cospasSarsatNumber}
        />
      )}
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
  var type = use.environment;

  if (
    type.toUpperCase().startsWith("AVIATION") ||
    type.toUpperCase().startsWith("AIRCRAFT")
  ) {
    type = Environments.Aviation;
  } else if (type.toUpperCase().startsWith("MARITIME")) {
    type = Environments.Maritime;
  } else if (type.toUpperCase().indexOf("RIG") > -1) {
    type = "RIG";
  } else {
    type = Environments.Land;
  }

  switch (type) {
    case Environments.Maritime:
      return <MaritimeUse use={use} index={index} />;
    case Environments.Aviation:
      return <AviationUse use={use} index={index} />;
    case Environments.Land:
      return <LandUse use={use} index={index} />;
    case "RIG":
      return <RigUse use={use} index={index} />;
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
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use -  ${use.environment} `}
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
          title="Max Persons Onboard"
          value={use.maxPersonOnBoard}
        />

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Position"
          value={use.beaconLocation}
        />

        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="full"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
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
          title="Hull ID Number"
          value={use.hullIdNumber}
        />

        <CertificateField classes="full" title="Notes" value={use.notes} />
      </div>
    </div>
  );
};

const RigUse: FunctionComponent<UseProps> = ({
  use,
  index,
}: UseProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use -  ${use.environment} `}
      </h4>
      <div className="section">
        <h3>Rig/Platform Details:</h3>

        {use.rigName && (
          <CertificateField
            classes="half"
            title="Rig Name"
            value={use.rigName}
          />
        )}

        <CertificateField
          classes="half"
          title="No. Persons In Group"
          value={use.maxPersonOnBoard}
        />

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Position (If fixed, not floating)"
          value={use.beaconLocation}
        />

        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="full"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}

        {use.vesselCallsign && (
          <CertificateField
            classes="half"
            title="Callsign"
            value={use.vesselCallsign}
          />
        )}

        <CertificateField
          classes="half"
          title="MMSI Number"
          value={use.mmsiNumber}
        />

        {use.imoNumber && (
          <CertificateField
            classes="half"
            title="IMO Number"
            value={use.imoNumber}
          />
        )}

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
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use -  ${use.environment} `}
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
          title="AOD Serial Number"
          value={use.aodSerialNumber}
        />

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Position"
          value={use.beaconLocation}
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

        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="full"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
        <br />
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
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use -  ${use.environment} `}
      </h4>
      <div className="section">
        <h3>Land Details:</h3>

        <CertificateField
          classes="full"
          title="Description Of Intended Use"
          value={use.descriptionOfIntendedUse}
        />
        <CertificateField
          classes="full"
          title="Number Of Persons In Group"
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
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Position"
          value={use.beaconLocation}
        />
        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="full"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
        <br />
        <CertificateField classes="full" title="Notes" value={use.notes} />
      </div>
    </div>
  );
};
export const GenericUse: FunctionComponent<UseProps> = ({
  //TODO - Remove this once legacy uses in place.
  use,
  index,
}: UseProps): JSX.Element => {
  return (
    <div className="use full">
      <h4 className="title use">
        {" "}
        {`#${index} Beacon Use -  ${use.environment} `}
      </h4>
      <div className="section">
        <h3>Use Details:</h3>

        {use.vesselName && (
          <CertificateField
            classes="half"
            title="Vessel Name"
            value={use.vesselName}
          />
        )}

        {use.rigName && (
          <CertificateField
            classes="half"
            title="Rig Name"
            value={use.rigName}
          />
        )}

        {use.rigPlatformLocation && (
          <CertificateField
            classes="half"
            title="Rig Platform Location"
            value={use.rigPlatformLocation}
          />
        )}

        <CertificateField
          classes="half"
          title="Beacon Position"
          value={use.beaconPosition}
        />

        <CertificateField
          classes="half"
          title="Position"
          value={use.beaconLocation}
        />

        <CertificateField
          classes="half"
          title="Homeport"
          value={use.homePort}
        />
        <CertificateField
          classes="half"
          title="Max Persons Onboard"
          value={use.maxPersonOnBoard}
        />
        {Object.keys(use.radioSystems).map((key, index) => (
          <CertificateField
            key={index}
            classes="full"
            title={key}
            value={use.radioSystems[key]}
          />
        ))}
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

        <br />

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
          classes="half"
          title="Aircraft Type"
          value={use.aircraftType}
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
          title="Aircraft Manufacturer & Model"
          value={use.aircraftManufacturer}
        />
        <CertificateField
          classes="half"
          title="24-Bit Address In Hex"
          value={use.twentyFourBitAddressInHex}
        />

        <CertificateField
          classes="half"
          title="AOD Serial Number"
          value={use.aodSerialNumber}
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
          classes="full"
          title="Aircraft Operators Designator (AOD) &amp; Serial No"
          value={use.aircraftOperatorsDesignatorAndSerialNo}
        />

        <CertificateField
          classes="full"
          title="Description Of Intended Use"
          value={use.descriptionOfIntendedUse}
        />
        <CertificateField
          classes="full"
          title="Number Of Persons In Group"
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
      </div>

      <CertificateField classes="full" title="Notes" value={use.notes} />
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
              title="Company Name"
              value={owner.companyName}
            />
            <CertificateField
              classes="half"
              title="Care Of"
              value={owner.careOf}
            />

            <CertificateField
              classes="half"
              title="Email"
              value={owner.email}
            />

            <CertificateField classes="half" title="Fax" value={owner.fax} />
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
          <div key={index} className={"full field"}>
            <span>{index + 1}: </span>
            <span>{ec.fullName}</span>
          </div>
        ))}
    </div>
  );
};
