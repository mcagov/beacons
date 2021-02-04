import React, { FunctionComponent } from "react";
import { Button } from "../components/Button";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { RadioList, RadioListItem } from "../components/RadioList";

const IntentPage: FunctionComponent = () => (
  <>
    <Layout>
      <Grid
        mainContent={
          <>
            <IntentPageContent />
          </>
        }
      />
    </Layout>
  </>
);

export const IntentPageContent: FunctionComponent = () => (
  <>
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
