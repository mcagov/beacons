import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton } from "../../../components/Button";
import { DataRowItem } from "../../../components/domain/DataRowItem";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { SummaryList, SummaryListItem } from "../../../components/SummaryList";
import { PageHeading, SectionHeading } from "../../../components/Typography";
import { Beacon } from "../../../entities/Beacon";
import { Registration } from "../../../entities/Registration";
import { beaconToRegistration } from "../../../lib/beaconToRegistration";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { PageURLs } from "../../../lib/urls";
import { formatDateTruncated } from "../../../lib/writingStyle";

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
              <SectionHeading>About the registration</SectionHeading>
              <SummaryList>
                <SummaryListItem labelText="Registration history">
                  <DataRowItem
                    label="First registered"
                    value={formatDateTruncated(registration.registeredDate)}
                  />
                </SummaryListItem>
              </SummaryList>
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
