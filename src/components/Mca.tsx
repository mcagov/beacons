import React, { FunctionComponent } from "react";
import { Details } from "./Details";
import { A } from "./Typography";

export const McaLogo: FunctionComponent = (): JSX.Element => (
  <>
    <a className="govuk-body govuk-!-margin-bottom-3" href="https://gov.uk/mca">
      <img src="../assets/images/mca-logo.png" alt="mca logo" />
    </a>
  </>
);

export const IfYouNeedHelp: FunctionComponent = (): JSX.Element => (
  <Details summaryText="If you need help completing this form">
    <ul className="govuk-list">
      <li>
        <b>The UK Beacon Registry</b>
      </li>

      <li>
        <A href="mailto:ukbeacons@mcga.gov.uk">ukbeacons@mcga.gov.uk</A>
      </li>

      <li>Telephone: 01326 211569</li>
      <li>Fax: 01326 319264</li>
      <li>Monday to Friday, 9am to 5pm (except public holidays)</li>

      <li className="govuk-!-margin-top-5">
        <A href="https://www.gov.uk/call-charges">
          Find out about call charges
        </A>
      </li>

      <li className="govuk-!-margin-top-5">
        In an emergency in the UK, dial 999 and ask for the Coastguard. If you
        are at sea, use GMDSS systems to make a distress or urgency
        alert:Emergency Contact - Dial 999 and ask for the Coastguard
      </li>
    </ul>
  </Details>
);
