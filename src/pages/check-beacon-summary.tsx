import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../components/Button";
import { Form, FormFieldset, FormGroup, FormLegend } from "../components/Form";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { SummaryList, SummaryListItem } from "../components/SummaryList";
import { NotificationBanner } from "../components/NotificationBanner";
import {
  RadioList,
  RadioListItem,
  RadioListItemHint,
} from "../components/RadioList";

const CheckBeaconSummaryPage: FunctionComponent = () => (
  <>
    <Layout>
      <Grid
        mainContent={
          <>
            <BackButton href="/check-beacon-details" />
            <BeaconAlreadyRegistered />
            <BeaconSummary />
            <WhatNext />
            <StartButton buttonText="Continue" href="/beacon-information" />
          </>
        }
      />
    </Layout>
  </>
);

const BeaconSummary: FunctionComponent = () => (
  <SummaryList>
    <SummaryListItem
      labelText="Beacon manufacturer"
      valueText="Name of a manufacturer"
    />
    <SummaryListItem labelText="Beacon model" valueText="Model name" />
    <SummaryListItem labelText="Beacon HEX ID" valueText="AF67 BB81 23CD 451" />
    <SummaryListItem
      labelText="Date registered"
      valueText="19 September 2016"
    />
  </SummaryList>
);

const BeaconAlreadyRegistered: FunctionComponent = () => (
  <NotificationBanner title="This beacon is already registered">
    <div className="govuk-body">
      There maybe a few reasons why this beacon is already registered,
      including:
    </div>
    <ul className="govuk-list govuk-list--bullet">
      <li>
        It has already been registered by yourself or someone else (e.g. if you
        bought it second hand)
      </li>
      <li>The manufacturer may have incorrectly reused the HEX ID</li>
    </ul>
  </NotificationBanner>
);

const WhatNext: FunctionComponent = () => (
  <Form url="/">
    <FormGroup>
      <FormFieldset>
        <FormLegend>What would you like to do next?</FormLegend>
        <RadioList>
          <RadioListItem
            id="try-again"
            name="do-next"
            value="try-again"
            text="Try again or register a different beacon"
          />
          <RadioListItemHint
            id="continue-anyway"
            name="do-next"
            value="continue-anyway"
            text="Continue anyway - I've entered the beacons details correctly. I think this is a manufacturer fault or want to update the owner details"
            hintText="We will contact the beacon manufacturer to rectify this. In the meantime, you can still use your beacon and Search & Rescue will still be able to locate you."
          />
        </RadioList>
      </FormFieldset>
    </FormGroup>
  </Form>
);

export default CheckBeaconSummaryPage;
