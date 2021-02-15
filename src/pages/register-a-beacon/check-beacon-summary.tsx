import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";

import { BeaconCacheEntry } from "../../lib/formCache";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { NotificationBannerSuccess } from "../../components/NotificationBanner";

import { BackButton, LinkButton } from "../../components/Button";
import { IfYouNeedHelp } from "../../components/Mca";
import {
  withCookieRedirect,
  getCache,
  updateFormCache,
} from "../../lib/middleware";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

interface BeaconDetailsProps {
  manufacturer: string;
  model: string;
  hexId: string;
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
  manufacturer,
  model,
  hexId,
}: BeaconDetailsProps): JSX.Element => (
  <>
    <h1 className="govuk-heading-l">Check beacon summary</h1>
    <SummaryList>
      <SummaryListItem
        labelText="Beacon manufacturer"
        valueText={manufacturer}
      />
      <SummaryListItem labelText="Beacon model" valueText={model} />
      <SummaryListItem labelText="Beacon HEX ID" valueText={hexId} />
      <SummaryListItem
        labelText="Date registered"
        // TODO: Lookup for date registered if beacon already in system
        valueText="Not yet registered"
      />
    </SummaryList>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    if (context.req.method === "POST") {
      const previousFormPageData: BeaconCacheEntry = await updateFormCache(
        context
      );

      return {
        props: { ...previousFormPageData },
      };
    } else if (context.req.method === "GET") {
      const existingState: BeaconCacheEntry = getCache(context);

      return { props: { ...existingState } };
    }

    return {
      props: {},
    };
  }
);

export default CheckBeaconSummaryPage;
