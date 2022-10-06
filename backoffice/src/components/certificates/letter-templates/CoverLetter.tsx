import "./letter.scss";
import { FunctionComponent } from "react";
import { CertificateProps } from "../BaseCertificate";

export const CoverLetter: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  return (
    <div className="letter">
      {/* <div className="certificate" onLoad={window.print}> */}
      <LetterHeader />

      <div className="content">
        <div className="section"></div>
      </div>
      <LetterFooter />
    </div>
  );
};

export const LetterHeader: FunctionComponent = (): JSX.Element => {
  return (
    <div className="header full">
      <div className="half">
        <div>OFFICIAL</div>
        <img
          src={process.env.PUBLIC_URL + "/mca-logo.png"}
          alt="Maritime &amp; Coastguard Agency"
          className="mcaLogo"
        />
      </div>
      <div className="half sender">
        <p className="bold">UK Distress &amp; Security Beacon Registration</p>
        <p>MCA Falmouth</p>
        <p>Pendennis Point, Castle Drive</p>
        <p>Falmouth</p>
        <p>Cornwall &nbsp; TR11 4WZ</p>
        <p>Tel.: &nbsp;&nbsp; 01326 211569</p>
        <p>Fax: &nbsp;&nbsp; 01326 319264</p>
        <p>Email: &nbsp;&nbsp; UKBeacons@mcga.gov.uk</p>
      </div>
    </div>
  );
};

const LetterFooter: FunctionComponent = (): JSX.Element => {
  return (
    <div className="footer full">
      <p>OFFICIAL</p>
    </div>
  );
};
