import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { BackButton, Button } from "../../components/Button";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Beacon } from "../../lib/types";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";

interface CheckYourAnswersProps {
  beacon: Beacon;
}

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  beacon,
}: CheckYourAnswersProps): JSX.Element => (
  <>
    <Layout
      navigation={<BackButton href="/register-a-beacon/beacon-information" />}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>
              Check your answers before sending in your registration
            </PageHeading>
            <BeaconInformation {...beacon} />
            <SendYourApplication />
            <Button buttonText="Accept and send" />
          </>
        }
      />
    </Layout>
  </>
);

const BeaconInformation: FunctionComponent<Beacon> = ({
  manufacturer,
  model,
  hexId,
  manufacturerSerialNumber,
  batteryExpiryDate,
  lastServicedDate,
}: Beacon): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Beacon information</h2>

    <SummaryList>
      <SummaryListItem
        labelText="Beacon manufacturer"
        valueText={manufacturer}
        actionText="Change"
        actionValue="beacon manufacturer"
      />
      <SummaryListItem
        labelText="Beacon model"
        valueText={model}
        actionText="Change"
        actionValue="beacon model"
      />
      <SummaryListItem
        labelText="Beacon HEX ID"
        valueText={hexId}
        actionText="Change"
        actionValue="beacon HEX ID"
      />
      <SummaryListItem
        labelText="Manufacturer serial number"
        valueText={manufacturerSerialNumber}
        actionText="Change"
        actionValue="manufacturer serial number"
      />
      <SummaryListItem
        labelText="Battery expiry date"
        valueText={batteryExpiryDate}
        actionText="Change"
        actionValue="battery expiry date"
      />
      <SummaryListItem
        labelText="Beacon service date"
        valueText={lastServicedDate}
        actionText="Change"
        actionValue="battery expiry date"
      />
    </SummaryList>
  </>
);

const SendYourApplication: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">Now send in your application</h2>

    <GovUKBody>
      By submitting this registration you are confirming that, to the best of
      your knowledge, the details you are providing are correct.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // TODO: State persistence stuff to go here

  const fakeBeacon: Beacon = {
    manufacturer: "Raleigh",
    model: "Chopper",
    hexId: "34D17AE391BC3",
    manufacturerSerialNumber: "PN000123",
    batteryExpiryDate: "17 November 2024",
    lastServicedDate: "13 October 2020",
  };

  return {
    props: { beacon: fakeBeacon },
  };
};

export default CheckYourAnswersPage;
