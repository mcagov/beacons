import "./letter.scss";
import { FunctionComponent } from "react";
import { ICertificate } from "gateways/exports/ICertificate";
import { customDateStringFormat } from "utils/dateTime";
import { ICertificateOwner } from "../../../gateways/exports/ICertificate";
export interface CertificateProps {
  certificate: ICertificate;
}

export const CoverLetter: FunctionComponent<CertificateProps> = ({
  certificate,
}): JSX.Element => {
  if (!certificate.owners) {
    return <p>Could not load owner</p>;
  }

  const owner = certificate.owners.at(0);
  return (
    <div className="letter">
      {/* <div className="letter" onLoad={window.print}> */}
      <LetterHeader />

      <div className="content">
        <div className="section">
          {owner && (
            <div className="half recipient">
              <h3 className="bold">{owner.ownerName}</h3>
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
          )}
          <div className="half date">
            {certificate.type == "Legacy" &&
              certificate.departmentReference && (
                <p>Dept Ref: {certificate.departmentReference}</p>
              )}
            <p>{customDateStringFormat(new Date(), "DD MMMM yyyy")}</p>
          </div>
        </div>
        <div className="section">
          <p>Dear Sir or Madam</p>

          <div className="registrationText">
            <p className="bold underline">
              406 MHz EMERGENCY BEACON REGISTRATION FOR AN ERIPB, PLB OR ELT
            </p>
            <p className="bold underline">
              VESSEL/AIRCRAFT: &nbsp;&nbsp; HEX ID: {certificate.hexId}
            </p>
          </div>

          <p>
            Thank you for registering your 406 MHz beacon, this is to confirm
            that it has been recorded on the UK Beacon database and a copy of
            the record is attached for you to check.
          </p>
          <p>
            It is a legal requirement to register UK 406 MHz beacons and
            depending on the size or your vessel or aircraft, you may be
            required to prove registration, as such we are enclosing two
            adhesive labels as proof of registration. Please make sure that one
            of the labels is attached to your beacon and the other is placed in
            a prominent position e.g. with the vessels' documentation. Please
            avoid placing a label on the battery cover if there is one because
            batteries are often replaced during servicing. Should you require
            further labels, please contact the Registry.
          </p>
          <p>
            The use of PLBs overland in the UK became legal in 2012 so if you
            own a PLB and wish to use it overland or if you intend to use your
            PLB on a variety of vessels, please advise us so we can update the
            Notes section on your record. For Search & Rescue action to be
            effective, it is vitally important that you let us know of any
            errors, omissions or changes affecting your record including the
            transfer of the beacon to a different vessel or owner, change of
            vessel name or any changes to any contact telephone numbers, or the
            loss, loan or theft of your beacon. On the back of the database
            report is a blank Registration form that you may use to inform us of
            any future changes, alternatively please send amendments via email,
            telephone us or our online form at:
            https://register-406-beacons.service.gov.uk
          </p>
        </div>

        <div className="section sign-off">
          <p>Yours faithfully,</p>
          <p className="sig">Sam Kendell</p>
          <p className="bold">UK Distress &amp; Security Beacon Registry</p>
          <br />
          <p>Enclosure(s)</p>
        </div>
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
        <p className="bold">UK Distress &amp; Security Beacon Registry</p>
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
      <p className="bold">OFFICIAL</p>
    </div>
  );
};
