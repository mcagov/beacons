import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { NotificationBannerSuccess } from "../../components/NotificationBanner";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { PageHeading } from "../../components/Typography";
import { CacheEntry } from "../../lib/formCache";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";

interface BeaconDetailsProps {
  manufacturer: string;
  model: string;
  hexId: string;
}

interface BeaconDetailsSummaryProps extends BeaconDetailsProps {
  heading: string;
}

const CheckBeaconSummaryPage: FunctionComponent<BeaconDetailsProps> = (
  props
): JSX.Element => {
  const pageHeading = "Beacon details checked";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/check-beacon-details" />
        }
        title={pageHeading}
        pageHasErrors={false}
      >
        <Grid
          mainContent={
            <BeaconNotRegisteredView {...props} heading={pageHeading} />
          }
        />
      </Layout>
    </>
  );
};

const BeaconNotRegisteredView: FunctionComponent<BeaconDetailsSummaryProps> = (
  props
): JSX.Element => {
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

const BeaconSummary: FunctionComponent<BeaconDetailsSummaryProps> = ({
  manufacturer,
  model,
  hexId,
  heading,
}: BeaconDetailsSummaryProps): JSX.Element => (
  <>
    <PageHeading>{heading}</PageHeading>
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
      const formData: CacheEntry = await parseFormData(context.req);
      updateFormCache(context.req.cookies, formData);

      return {
        props: { ...formData },
      };
    } else if (context.req.method === "GET") {
      const existingState: CacheEntry = getCache(context.req.cookies);

      return { props: { ...existingState } };
    }

    return {
      props: {},
    };
  }
);

export default CheckBeaconSummaryPage;
