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
          classes="half uppercase"
          title="Proof Of Registration"
          value={customDateStringFormat(
            beacon.proofOfRegistrationDate,
            "DD/MM/yyyy"
          ).toUpperCase()}
        />

        {beacon.type === "Legacy" && (
          <CertificateField
            classes="half"
            title="Dept Ref"
            value={beacon.departmentReference}
          />
        )}

        {beacon.type === "New" && (
          <CertificateField
            classes="half"
            title="Reference"
            value={beacon.referenceNumber}
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
        <span>Office Hours Tel: 020 3817 2006 Fax: +44 (0)1326 319264</span>
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
