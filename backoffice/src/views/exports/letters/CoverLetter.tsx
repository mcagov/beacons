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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id sapien orci. Duis lobortis vitae orci a rutrum. Donec dui ligula,
            consequat in odio et, scelerisque ultrices erat.
          </p>
          <p>
            Sed lorem libero, volutpat eget elit id, tincidunt tempor dolor.
            Phasellus ultrices arcu placerat, commodo velit at, faucibus elit.
            Donec placerat, leo ac consequat varius, nisl justo tempus odio,
            eget lacinia magna enim eget massa. Ut aliquet dolor vel tincidunt
            facilisis. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Phasellus eros sapien, placerat tempus metus et, faucibus
            mattis massa. Donec vitae libero aliquet augue faucibus mollis eu at
            lacus. Nunc varius dolor lacus, in sollicitudin tellus viverra ut.
            Donec eu ex leo. Morbi laoreet purus non libero aliquam, vel aliquam
            eros sagittis.
          </p>
          <p>
            Suspendisse feugiat, eros at tincidunt ullamcorper, augue dui luctus
            quam, varius fringilla urna enim auctor ipsum. Praesent lobortis
            hendrerit felis, auctor finibus nisi. Maecenas turpis velit, mattis
            id elit ut, vulputate hendrerit elit. Donec at risus iaculis,
            convallis nunc nec, facilisis quam. Proin neque nisl, luctus sed
            nulla eget, porttitor blandit leo. Integer egestas ultrices turpis
            eget venenatis. Ut non nibh erat. Donec malesuada aliquam turpis.
            Duis vel semper ex. Cras vel elit arcu. Nulla ultricies est sed
            ornare semper. Donec vel libero pellentesque, pulvinar ligula ut,
            semper felis. Aliquam erat volutpat. Suspendisse potenti. Ut sit
            amet est eros. Nulla ultricies est sed ornare semper. Donec vel
            libero pellentesque, pulvinar ligula ut, semper felis. Aliquam erat
            volutpat. Suspendisse potenti. Ut sit amet est eros.
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
