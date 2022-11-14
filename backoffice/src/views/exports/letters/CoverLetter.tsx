import "./letter.scss";
import { FunctionComponent } from "react";
import { IBeaconExport } from "gateways/exports/IBeaconExport";
import { customDateStringFormat } from "utils/dateTime";
export interface LetterProps {
  beacon: IBeaconExport;
  type: "Registration" | "Amended";
}

export const CoverLetter: FunctionComponent<LetterProps> = ({
  beacon,
  type,
}): JSX.Element => {
  if (!beacon.owners) {
    return <p>Could not load owner</p>;
  }

  const owner = beacon.owners.at(0);
  return (
    <div className="letter">
      <div className="header full">
        <div className="half">
          <p className="bold">OFFICIAL</p>
          <img
            src={process.env.PUBLIC_URL + "/mca-logo.png"}
            alt="Maritime &amp; Coastguard Agency"
            className="mcaLogo"
          />

          {owner && (
            <div className="half recipient">
              <div className="address-fields">
                {[
                  owner.ownerName,
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
        </div>

        <div className="half sender">
          <p className="bold">UK Distress &amp; Security Beacon Registry</p>
          <p>MCA Falmouth</p>
          <p>Pendennis Point, Castle Drive</p>
          <p>Falmouth</p>
          <p>Cornwall &nbsp; TR11 4WZ</p>
          <p>Tel: &nbsp;&nbsp; 020 3817 2006</p>
          <p>Fax: &nbsp;&nbsp; 01326 319264</p>
          <p>Email: &nbsp;&nbsp; UKBeacons@mcga.gov.uk</p>
          <br />
          <br />
          {beacon.type === "Legacy" && beacon.departmentReference && (
            <p>Dept Ref: {beacon.departmentReference}</p>
          )}
          <p className="underline">www.gov.uk/mca</p>
          <p>{customDateStringFormat(new Date(), "DD MMMM yyyy")}</p>
        </div>
      </div>

      <div className="content">
        {owner && (
          <div className="section">
            <p>Dear {owner.ownerName}</p>
          </div>
        )}

        <div className="section registrationText">
          <div className="subject">
            <p className="bold underline">
              406 MHz EMERGENCY BEACON REGISTRATION FOR AN EPIRB, PLB OR ELT.
            </p>
            <p className="bold underline uppercase">
              VESSEL/AIRCRAFT: {beacon.name} &nbsp; HEX ID: {beacon.hexId}
            </p>
          </div>
          {type === "Registration" && <RegistrationBody />}
          {type === "Amended" && <AmendedBody />}
        </div>
        <div className="section sign-off">
          <p>Yours sincerely,</p>
          <p className="bold">
            The UK Distress &amp; Security Beacon Registry Team
          </p>
          <br />
          <br />
          <br />
          <p>Enclosure(s)</p>
        </div>
      </div>
      <LetterFooter />
    </div>
  );
};

export const RegistrationBody: FunctionComponent = (): JSX.Element => {
  return (
    <div className="letter-content">
      <p>
        Thank you for registering your 406 MHz beacon, this is to confirm that
        it has been recorded on the UK Beacon database and a copy of the record
        is attached for you to check.
      </p>
      <p>
        It is a legal requirement to register UK 406 MHz beacons and depending
        on the size or your vessel or aircraft, you may be required to prove
        registration, as such we are enclosing two adhesive labels as proof of
        registration. Please make sure that one of the labels is attached to
        your beacon and the other is placed in a prominent position e.g. with
        the vessels' documentation. Please avoid placing a label on the battery
        cover if there is one because batteries are often replaced during
        servicing. Should you require further labels, please contact the
        Registry.
      </p>
      <p>
        The use of PLBs overland in the UK became legal in 2012. If you own a
        PLB, and wish to use it overland, or if you intend to use your PLB on a
        variety of vessels, please sign-in to your online account and add
        additional uses.
      </p>

      <p>
        For Search & Rescue action to be effective, it is vitally important that
        your record(s) are kept up-to-date in your online account at:{" "}
        <span className="underline">
          https://www.gov.uk/register-406-beacons
        </span>
      </p>
    </div>
  );
};

export const AmendedBody: FunctionComponent = (): JSX.Element => {
  return (
    <div className="letter-content">
      <p>
        Thank you for informing us of a change in details for your 406 MHz
        beacon, attached is an updated report for you to check.
      </p>

      <p>
        The use of PLBs overland in the UK became legal in 2012 so if you own a
        PLB and wish to use it overland or if you intend to use your PLB on a
        variety of vessels, please sign-in to your online account and add
        additional uses.
      </p>

      <p>
        For Search & Rescue action to be effective, it is vitally important that
        your record(s) are kept up-to-date in your online account at:{" "}
        <span className="underline">
          https://www.gov.uk/register-406-beacons
        </span>
      </p>
    </div>
  );
};

const LetterFooter: FunctionComponent = (): JSX.Element => {
  return (
    <div className="footer full">
      <div className="text"></div>
      <img
        src={
          process.env.PUBLIC_URL +
          "/assets/letter/Investors-in-People-Silver.png"
        }
        alt="Investors in People silver logo"
        className="investors-in-people-logo"
      />
    </div>
  );
};
