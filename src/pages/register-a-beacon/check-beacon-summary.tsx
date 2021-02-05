import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";

import parse from "urlencoded-body-parser";
import { GetServerSideProps } from "next";
import { IFormCache, FormCacheFactory } from "../../lib/form-cache";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { NotificationBanner } from "../../components/NotificationBanner";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegend,
} from "../../components/Form";
import {
  RadioList,
  RadioListItem,
  RadioListItemHint,
} from "../../components/RadioList";
import { BackButton, StartButton } from "../../components/Button";

interface BeaconDetailsProps {
  beaconManufacturer: string;
  beaconModel: string;
  beaconHexId: string;
}

const CheckBeaconSummaryPage: FunctionComponent<BeaconDetailsProps> = (
  props
): JSX.Element => {
  return (
    <>
      <Layout breadcrumbs={<BackButton href="/check-beacon-details" />}>
        <Grid
          mainContent={
            <>
              <BeaconAlreadyRegistered />
              <BeaconSummary {...props} />
              <WhatNext />
              <StartButton buttonText="Continue" href="/beacon-information" />
            </>
          }
        />
      </Layout>
    </>
  );
};

const BeaconSummary: FunctionComponent<BeaconDetailsProps> = ({
  beaconManufacturer,
  beaconModel,
  beaconHexId,
}: BeaconDetailsProps): JSX.Element => (
  <SummaryList>
    <SummaryListItem
      labelText="Beacon manufacturer"
      valueText={beaconManufacturer}
    />
    <SummaryListItem labelText="Beacon model" valueText={beaconModel} />
    <SummaryListItem labelText="Beacon HEX ID" valueText={beaconHexId} />
    <SummaryListItem
      labelText="Date registered"
      // TODO: Lookup for date registered if beacon already in system
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
  <Form action="/">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === "POST") {
    const previousFormPageData: BeaconDetailsProps = await parse(context.req);

    const state: IFormCache = FormCacheFactory.getState();
    state.set("id", previousFormPageData);

    return {
      props: previousFormPageData,
    };
  } else if (context.req.method === "GET") {
    const state: IFormCache = FormCacheFactory.getState();
    const existingState = state.get("id");

    return { props: existingState };
  }

  return {
    props: {},
  };
};

export default CheckBeaconSummaryPage;
