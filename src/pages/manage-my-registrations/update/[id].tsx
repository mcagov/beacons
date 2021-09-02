import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton } from "../../../components/Button";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { PageHeading } from "../../../components/Typography";
import { Beacon } from "../../../entities/Beacon";
import { Registration } from "../../../entities/Registration";
import { beaconToRegistration } from "../../../lib/beaconToRegistration";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { PageURLs } from "../../../lib/urls";

interface RegistrationSummaryPageProps {
  registration: Registration;
}

const RegistrationSummaryPage: FunctionComponent<RegistrationSummaryPageProps> =
  ({ registration }: RegistrationSummaryPageProps): JSX.Element => {
    const pageHeading = `Your registered beacon with Hex ID/UIN: ${registration.hexId}`;
    return (
      <Layout
        navigation={<BackButton href={PageURLs.accountHome} />}
        title={pageHeading}
        showCookieBanner={true}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
            </>
          }
        />
      </Layout>
    );
  };

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const { getBeaconsByAccountHolderId, getAccountHolderId } =
      context.container;

    const beacon: Beacon = (
      await getBeaconsByAccountHolderId(
        await getAccountHolderId(context.session)
      )
    ).find((beacon) => beacon.id === context.query.id);

    return {
      props: {
        registration: beaconToRegistration(beacon),
      },
    };
  })
);

export default RegistrationSummaryPage;
