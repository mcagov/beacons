import React, { FunctionComponent } from "react";
import { Details } from "./Details";
import { AnchorLink, GovUKList } from "./Typography";

export const McaLogo: FunctionComponent = (): JSX.Element => (
  <>
    <a className="govuk-body govuk-!-margin-bottom-3" href="https://gov.uk/mca">
      <img
        src="/assets/mca_images/mca-logo.png"
        alt="Maritime & Coastguard Agency logo"
      />
    </a>
  </>
);

export const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <BeaconRegistryContactInfo />
    <p className="govuk-!-margin-top-5">
      In an emergency in the UK, dial 999 and ask for the Coastguard. If you are
      at sea and have GMDSS systems, use them to make a distress or urgency
      alert.
    </p>
  </Details>
);

export const BeaconRegistryContactInfo: FunctionComponent = (): JSX.Element => (
  <div>
    <h3 className="govuk-!-font-weight-bold">The UK Beacon Registry</h3>
    <GovUKList>
      <li>
        <a className="govuk-link" href="mailto:ukbeacons@mcga.gov.uk">
          ukbeacons@mcga.gov.uk
        </a>
      </li>
      <li>Telephone: +44 (0)20 3817 2006</li>
      <li>Fax: +44 (0)1326 319264</li>
      <li>Monday to Friday, 9am to 5pm (except public holidays)</li>
      <li>
        <AnchorLink href="https://www.gov.uk/call-charges">
          Find out about call charges
        </AnchorLink>
      </li>
    </GovUKList>
  </div>
);
