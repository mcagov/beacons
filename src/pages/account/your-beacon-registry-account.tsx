import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import { PageHeading, SectionHeading } from "../../components/Typography";

interface YourBeaconRegistyAccountPageProps {
  id?: string;
}

export const YourBeaconRegistyAccount: FunctionComponent<YourBeaconRegistyAccountPageProps> =
  (): JSX.Element => {
    const pageHeading = "Your Beacon Registy Account";

    return (
      <Layout title={pageHeading} showCookieBanner={false}>
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <YourDetails></YourDetails>
              <YourBeacons></YourBeacons>
              <RegisterANewBeacon></RegisterANewBeacon>
              <Contact></Contact>
            </>
          }
        />
      </Layout>
    );
  };

const YourDetails: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Your details</SectionHeading>
  </>
);

const YourBeacons: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>You have x registered beacons</SectionHeading>
  </>
);

const RegisterANewBeacon: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Register a new beacon</SectionHeading>
  </>
);

const Contact: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Contact the UK Beacon Registry</SectionHeading>
    <BeaconRegistryContactInfo />
  </>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

export default YourBeaconRegistyAccount;
