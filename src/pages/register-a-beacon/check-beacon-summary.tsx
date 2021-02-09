import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";

import parse from "urlencoded-body-parser";
import { IFormCache, FormCacheFactory } from "../../lib/form-cache";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { NotificationBannerSuccess } from "../../components/NotificationBanner";

import { BackButton, LinkButton } from "../../components/Button";
import { IfYouNeedHelp } from "../../components/Mca";
import { cookieRedirect } from "../../lib/middleware";

interface BeaconDetailsProps {
  beaconManufacturer: string;
  beaconModel: string;
  beaconHexId: string;
}

const CheckBeaconSummaryPage: FunctionComponent<BeaconDetailsProps> = (
  props
): JSX.Element => (
  <>
    <Layout
      navigation={<BackButton href="/register-a-beacon/check-beacon-details" />}
    >
      <Grid mainContent={<BeaconNotRegisteredView {...props} />} />
    </Layout>
  </>
);

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
      <LinkButton
        buttonText={"Continue"}
        href={"/register-a-beacon/check-your-answers"}
      />
      <IfYouNeedHelp />
    </>
  );
};

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
        valueText="Not yet registered"
      />
    </SummaryList>
  </>
);

// TODO: Encapsulate the state caching function
export const getServerSideProps = async (context) => {
  cookieRedirect(context);

  if (context.req.method === "POST") {
    // TODO: Investigate more widely used library for parse()
    const previousFormPageData: BeaconDetailsProps = await parse(context.req);

    const state: IFormCache = FormCacheFactory.getCache();
    state.update("id", previousFormPageData);

    return {
      props: previousFormPageData,
    };
  } else if (context.req.method === "GET") {
    const state: IFormCache = FormCacheFactory.getCache();
    const existingState = state.get("id");

    return { props: existingState };
  }

  return {
    props: {},
  };
};

export default CheckBeaconSummaryPage;
