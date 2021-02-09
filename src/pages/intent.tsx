import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../components/Button";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { RadioList, RadioListItemHint } from "../components/RadioList";
import { Form, FormFieldset, FormGroup, FormLegend } from "../components/Form";
import { BeaconIntent } from "../lib/types";

const IntentPage: FunctionComponent = () => (
  <>
    <Layout navigation={<BackButton href="/" />}>
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

const IntentPageContent: FunctionComponent = () => (
  <Form action="/register-a-beacon/check-beacon-details">
    <FormGroup>
      <FormFieldset>
        <FormLegend>What would you like to do?</FormLegend>
        <RadioList className="govuk-!-margin-bottom-3">
          <RadioListItemHint
            id="create-beacon"
            name="beacon-intent"
            value={BeaconIntent.CREATE}
            text="Register a new beacon"
            hintText="Choose this option to register one or multiple new beacons"
          />
          <RadioListItemHint
            id="other"
            name="beacon-intent"
            value={BeaconIntent.OTHER}
            text="Ask the Beacon Registry team a question"
            hintText="Choose this option if you have a specific question for the Beacon Registry"
          />
        </RadioList>

        <Button buttonText="Continue" />
      </FormFieldset>
    </FormGroup>
  </Form>
);

export default IntentPage;
