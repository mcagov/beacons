import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";

import parse from "urlencoded-body-parser";
import { GetServerSideProps } from "next";
import { IFormCache, FormCacheFactory } from "../../lib/form-cache";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import {
  NotificationBanner,
  NotificationBannerSuccess,
} from "../../components/NotificationBanner";
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
import { BackButton, LinkButton, StartButton } from "../../components/Button";
import { BeaconRegistryContactInfo, IfYouNeedHelp } from "../../components/Mca";
import {
  AnchorLink,
  GovUKBody,
  GovUKBulletedList,
} from "../../components/Typography";
import { InsetText } from "../../components/InsetText";

interface BeaconDetailsProps {
  beaconManufacturer: string;
  beaconModel: string;
  beaconHexId: string;
}

enum PageView {
  BEACON_ALREADY_REGISTERED,
  BEACON_NOT_REGISTERED,
  BEACON_CANNOT_BE_REGISTERED,
}

const CheckBeaconSummaryPage: FunctionComponent<BeaconDetailsProps> = (
  props
): JSX.Element => {
  const component: JSX.Element = <BeaconAlreadyRegisteredView {...props} />;

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/check-beacon-details" />
        }
      >
        <Grid mainContent={<BeaconCannotBeRegisteredView {...props} />} />
      </Layout>
    </>
  );
};

const BeaconAlreadyRegisteredView: FunctionComponent<BeaconDetailsProps> = (
  props
) => {
  return (
    <>
      <BeaconAlreadyRegistered />
      <BeaconSummary {...props} />
      <WhatNext />
      <StartButton buttonText="Continue" href="/beacon-information" />
      <LinkButton buttonText={"Continue"} href={"/beacon-information"} />
      <IfYouNeedHelp />
    </>
  );
};

const BeaconNotRegisteredView: FunctionComponent<BeaconDetailsProps> = (
  props
) => {
  return (
    <>
      <NotificationBannerSuccess title="Beacon details checked">
        <div>
          This beacon is a valid 406MHz UK encoded beacon that has not been
          registered before.
        </div>
        <div>
          You can now enter the remaining beacon information necessary to
          register.
        </div>
      </NotificationBannerSuccess>
      <BeaconSummary {...props} />
      <LinkButton buttonText={"Continue"} href={"/beacon-information"} />
      <IfYouNeedHelp />
    </>
  );
};

const BeaconCannotBeRegisteredView: FunctionComponent<BeaconDetailsProps> = () => (
  <>
    <NotificationBanner
      title="Beacon not 406Mhz or UK encoded"
      heading="This beacon is not a UK encoded 406MHz beacon"
    >
      <GovUKBody>
        Unfortunately this beacon cannot be registered with the Maritime &
        Coastguard Agency.
      </GovUKBody>
      <GovUKBody>
        <AnchorLink href={"/"}>
          Try again or register a different beacon
        </AnchorLink>{" "}
        if you think the details entered were a mistake.
      </GovUKBody>
    </NotificationBanner>
    <BeaconCannotBeRegisteredNextSteps />
    <ContactTheUKBeaconRegistry />
  </>
);

const ContactTheUKBeaconRegistry: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Contact the UK Beacon Registry</h2>
    <GovUKBody>
      If you need additional advice regarding your beacon, you can contact the
      UK Beacon Registry for help.
    </GovUKBody>
    <InsetText>
      <BeaconRegistryContactInfo />
    </InsetText>
  </>
);

const BeaconCannotBeRegisteredNextSteps: FunctionComponent = () => (
  <>
    <h1 className="govuk-heading-l">Suggested next steps</h1>
    <GovUKBody>
      Because this beacon is not covered by the Maritime & Coastguard Agency, we
      urge you to check the following before setting off on any journey with
      your beacon:
    </GovUKBody>

    <GovUKBulletedList>
      <li>
        Read the instructions that came with your beacon. It should include
        details of how to register it and with whom
      </li>
      <li>
        Contact your beacon manufacturer or supplier for details on how to
        register your beacon and what happens if you need to use it in an
        emergency (eg who will receive your distress signal and alert the
        authorities)
      </li>
      <li>
        If you acquired a beacon without the original box and instructions, you
        should contact the person(s) you acquired the beacon from to understand
        how to register the beacon properly
      </li>
      <li>
        Alternatively, you may want to consider purchasing a 406MHz UK encoded
        beacon as that can be registered with the Maritime & Coastguard Agency
        and, ensuring that you will be located in an emergency situation.
      </li>
    </GovUKBulletedList>
  </>
);

const BeaconSummary: FunctionComponent<BeaconDetailsProps> = ({
  beaconManufacturer,
  beaconModel,
  beaconHexId,
}: BeaconDetailsProps): JSX.Element => (
  <>
    <h1 className="govuk-heading-l">Check beacon summary</h1>
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
  </>
);

const BeaconAlreadyRegistered: FunctionComponent = () => (
  <NotificationBanner
    title="This beacon is already registered"
    heading="There maybe a few reasons why this beacon is already registered,
      including:"
  >
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

// TODO: Encapsulate the state caching function
export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.method === "POST") {
    // TODO: Investigate more widely used library for parse()
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
