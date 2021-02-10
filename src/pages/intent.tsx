import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../components/Button";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { RadioList, RadioListItemHint } from "../components/RadioList";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../components/Form";
import { BeaconIntent } from "../lib/types";
import { ErrorSummary } from "../components/ErrorSummary";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { updateFormCache } from "../lib/middleware";
import { BeaconCacheEntry } from "../lib/form-cache";

interface IntentProps {
  isError: boolean;
}
const IntentPage: FunctionComponent<IntentProps> = (
  props: IntentProps
): JSX.Element => (
  <>
    <Layout navigation={<BackButton href="/" />}>
      <Grid
        mainContent={
          <>
            {props.isError ? <ErrorSummaryComponent /> : ""}
            <IntentPageContent {...props} />
          </>
        }
      />
    </Layout>
  </>
);

const ErrorSummaryComponent: FunctionComponent = () => (
  <ErrorSummary>
    <li>
      <a href="#intent-error">Please select an option</a>
    </li>
  </ErrorSummary>
);

const IntentPageContent: FunctionComponent<IntentProps> = (
  props: IntentProps
) => (
  <Form action="/intent">
    <FormGroup>
      <FormFieldset>
        <FormLegendPageHeading>
          What would you like to do?
        </FormLegendPageHeading>
        {props.isError ? <ErrorMessage /> : ""}
        <RadioList className="govuk-!-margin-bottom-3">
          <RadioListItemHint
            id="create-beacon"
            name="beaconIntent"
            value={BeaconIntent.CREATE}
            text="Register a new beacon"
            hintText="Choose this option to register one or multiple new beacons"
          />
          <RadioListItemHint
            id="other"
            name="beaconIntent"
            value={BeaconIntent.OTHER}
            text="Ask the Beacon Registry team a question"
            hintText="Choose this option if you have a specific question for the Beacon Registry"
          />
        </RadioList>
      </FormFieldset>
    </FormGroup>
    <Button buttonText="Continue" />
  </Form>
);

const ErrorMessage: FunctionComponent = () => (
  <span id="intent-error" className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span> Please select an
    option
  </span>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.req.method === "POST") {
    const formData: BeaconCacheEntry = await updateFormCache(context);

    if (formData.beaconIntent) {
      return {
        redirect: {
          destination: "/register-a-beacon/check-beacon-details",
          permanent: false,
        },
      };
    } else {
      return {
        props: { isError: true },
      };
    }
  }
  return {
    props: {},
  };
};

export default IntentPage;
