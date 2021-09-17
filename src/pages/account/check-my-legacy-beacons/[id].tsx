import { GetServerSideProps } from "next";
import React from "react";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { BeaconRegistryContactInfo } from "../../../components/Mca";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../../../components/Typography";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface LegacyBeaconPageProps {
  legacyBeacon: any;
}

const CheckMyLegacyBeacon = ({ legacyBeacon, showCookieBanner }) => {
  const pageHeading = "Legacy Beacon Information";

  return (
    <Layout title={pageHeading}>
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <dl className="govuk-summary-list govuk-summary-list--no-border">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                  Date first registered
                </dt>
                <dd className="govuk-summary-list__value">19 January 2020</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Date last updated</dt>
                <dd className="govuk-summary-list__value">04 May 2021</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Hex ID/UIN</dt>
                <dd className="govuk-summary-list__value">1D0E9B07CEFFBFF</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Beacon Manufacturer</dt>
                <dd className="govuk-summary-list__value">Ocaen Signal</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Beacon Model</dt>
                <dd className="govuk-summary-list__value">1st Gen PLB</dd>
              </div>
            </dl>
            <SectionHeading>Contact the Beacon Registry Team</SectionHeading>
            <GovUKBody>
              If you have a question about your beacon registration, contact the
              UK Beacon Registry team on:
            </GovUKBody>
            <BeaconRegistryContactInfo />
          </>
        }
      ></Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<any> => {
  const legacyBeaconId = context.query.id as string;
  const legacyBeacon =
    await context.container.legacyBeaconGateway.getLegacyBeacon(legacyBeaconId);
  return legacyBeacon;
};

export default CheckMyLegacyBeacon;

// [ ] Cypress can programmatically submit a LegacyBeacon to the migrations end point (behind basic auth)
// [ ] Assert that the user's LegacyBeacon is visible
// [ ] LegacyBeaconGateway + UseCase
