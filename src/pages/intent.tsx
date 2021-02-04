import React, { FunctionComponent } from "react";
import { Button } from "../components/Button";
import { Grid } from "../components/Grid";
import { RadioList, RadioListItem } from "../components/RadioList";

const IntentPage: FunctionComponent = () => (
  <>
    <Grid
      mainContent={
        <>
          <PageHeading />
          <IntentPageContent />
        </>
      }
    />
  </>
);

const PageHeading: FunctionComponent = () => (
  <h1 className="govuk-heading-l">Register a UK 406 MHz beacon</h1>
);

export const IntentPageContent: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Data protection regulations</h2>

    <p className="govuk-body">
      The Maritime and Coastguard Agency (MCA) collect and retain the personal
      information provided when you register a UK coded 406 MHz beacon.
      Processing your information allows the MCA to exercise its official duty
      and to identify persons in distress and helps save lives.
    </p>

    <p className="govuk-body">
      We will retain your information until we are advised that the beacon is no
      longer active, for example it has been removed from the vessel, replaced
      or destroyed.
    </p>

    <p className="govuk-body">
      We will share your information with Global Search &amp; Rescue authorities
      and those delegated authorities, such as RNLI Lifeboats, Police or Rescue
      Helicopter crew, that are directly involved with investigations relating
      to a beacon activation.
    </p>

    <p className="govuk-body">
      Further details on Beacon Registration’s privacy policy can be found at{" "}
      <a
        className="govuk-link"
        href="https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice"
      >
        https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice
      </a>
    </p>

    <p className="govuk-body">
      To find out more about how the MCA looks after personal data, your rights,
      and how to contact our data protection officer, please go to{" "}
      <a
        className="govuk-link"
        href="https://www.gov.uk/government/organisations/maritime-and-coastguard-agency/about/personal-information-charter"
      >
        www.gov.uk/mca/privacy-policy
      </a>
    </p>

    <RadioList radioListTitleText="What would you like to do?">
      <RadioListItem
        id="create_beacon"
        name="beacon_intent"
        value="create_beacon"
        text="Register a new beacon"
        hintText="Choose this option to register one or multiple new beacons"
      />
      <RadioListItem
        id="change_beacon"
        name="beacon_intent"
        value="change_beacon"
        text="Update details for existing beacon(s) you've already registered"
        hintText="Choose this option to change existing beacon details, vessel and aircraft details, owner details and emergency contact information"
      />
      <RadioListItem
        id="ownership"
        name="beacon_intent"
        value="ownership"
        text="Change beacon ownership"
        hintText="Choose this option if you have acquired a beacon from another owner, or are no longer a beacon owner"
      />
      <RadioListItem
        id="withdraw"
        name="beacon_intent"
        value="withdraw"
        text="Withdraw a beacon"
        hintText="Choose this option to inform us your beacon has been destroyed or withdrawn from use"
      />
      <RadioListItem
        id="other"
        name="beacon_intent"
        value="other"
        text="Ask the Beacon Registry team a question"
        hintText="Choose this option if you have a specific question for the Beacon Registry"
      />
    </RadioList>

    <Button buttonText="Continue" />
  </>
);

export default IntentPage;
