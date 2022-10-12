import "./certificate.scss";
import { FunctionComponent } from "react";
import { customDateStringFormat } from "utils/dateTime";
import {
  IBeaconExport,
  IBeaconExportUse,
} from "gateways/exports/IBeaconExport";

export interface BeaconExportProps {
  beacon: IBeaconExport;
}

export interface UseProps {
  use: IBeaconExportUse;
  index: number;
}
interface CertificateFieldProps {
  classes: string;
  title: string;
  value: any;
}

export function CertificateField({
  classes,
  title,
  value,
}: CertificateFieldProps) {
  return (
    <div className={classes + " field"}>
      <span className="title">{title}: </span>
      <span>{value}</span>
    </div>
  );
}

export const CertificateHeader: FunctionComponent<BeaconExportProps> = ({
  beacon,
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
            beacon.proofOfRegistrationDate,
            "DD MMMM yyyy"
          )}
        />

        {beacon.type == "Legacy" && (
          <CertificateField
            classes="half"
            title="Dept Ref"
            value={beacon.departmentReference}
          />
        )}
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

export const CertificateFooter: FunctionComponent = (): JSX.Element => {
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

export const GenericUse: FunctionComponent<UseProps> = ({
  //TODO - Remove this once legacy uses in place.
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
      </div>

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
        <CertificateField
          classes="full"
          title="Aircraft Operators Designator (AOD) &amp; Serial No"
          value={use.aircraftOperatorsDesignatorAndSerialNo}
        />
      </div>

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
      </div>

      <CertificateField classes="full" title="Notes" value={use.notes} />
    </div>
  );
};
