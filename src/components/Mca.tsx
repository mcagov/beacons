import React, { FunctionComponent } from "react";
import { Details } from "./Details";
import { AnchorLink, GovUKList } from "./Typography";

export const McaLogo: FunctionComponent = (): JSX.Element => (
  <>
    <a className="govuk-body govuk-!-margin-bottom-3" href="https://gov.uk/mca">
      <img src="../assets/images/mca-logo.png" alt="mca logo" />
    </a>
  </>
);

export const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <BeaconRegistryContactInfo />
    <p className="govuk-!-margin-top-5">
      In an emergency in the UK, dial 999 and ask for the Coastguard. If you are
      at sea, use GMDSS systems to make a distress or urgency alert:Emergency
      Contact - Dial 999 and ask for the Coastguard
    </p>
  </Details>
);

export const BeaconRegistryContactInfo: FunctionComponent = (): JSX.Element => (
  <GovUKList>
    <li className="govuk-!-font-weight-bold">The UK Beacon Registry</li>
    <li>
      <a className="govuk-link" href="mailto:ukbeacons@mcga.gov.uk">
        ukbeacons@mcga.gov.uk
      </a>
    </li>
    <li>Telephone: 01326 211569</li>
    <li>Fax: 01326 319264</li>
    <li>Monday to Friday, 9am to 5pm (except public holidays)</li>
    <li>
      <AnchorLink href="https://www.gov.uk/call-charges">
        Find out about call charges
      </AnchorLink>
    </li>
  </GovUKList>
);
