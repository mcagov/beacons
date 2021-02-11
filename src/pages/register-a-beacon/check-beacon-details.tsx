import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegendPageHeading,
  FormLabel,
  FormGroup,
  Select,
  SelectOption,
  FormHint,
} from "../../components/Form";
import { Details } from "../../components/Details";
import { IfYouNeedHelp } from "../../components/Mca";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { BeaconCacheEntry } from "../../lib/form-cache";
import { updateFormCache } from "../../lib/middleware";
import { ErrorSummary } from "../../components/ErrorSummary";

interface CheckBeaconDetailsProps {
  manufacturerError?: boolean;
  modelError?: boolean;
  hexIdError?: boolean;
}

interface BeaconManufacturerInputProps {
  isError: boolean;
}

interface BeaconModelInputProps {
  isError: boolean;
}

interface BeaconHexIdSelectProps {
  isError: boolean;
}

interface ErrorMessageProps {
  id: string;
  message: string;
}

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  manufacturerError = false,
  modelError = false,
  hexIdError = false,
}: CheckBeaconDetailsProps): JSX.Element => (
  <>
    <Layout navigation={<BackButton href="/" />}>
      <Grid
        mainContent={
          <>
            {manufacturerError && <ErrorSummaryComponent />}
            <Form action="/register-a-beacon/check-beacon-details">
              <FormFieldset>
                <FormLegendPageHeading>
                  Check beacon details
                </FormLegendPageHeading>
                <InsetText>
                  The details of your beacon must be checked to ensure they have
                  a UK encoding and if they are already registered with this
                  service.
                </InsetText>

                <BeaconManufacturerInput isError={manufacturerError} />

                <BeaconModelInput isError={modelError} />

                <BeaconHexIdInput isError={hexIdError} />
              </FormFieldset>
              <Button buttonText="Submit" />
            </Form>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  </>
);

const ErrorSummaryComponent: FunctionComponent = () => (
  <ErrorSummary>
    <li>
      <a href="#manufacturer">Please select a beacon manufacturer</a>
    </li>
    <li>
      <a href="#model"> Please select a model</a>
    </li>
    <li>
      <a href="#hexId"> Please enter a valid Hex ID</a>
    </li>
  </ErrorSummary>
);

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  id,
  message,
}: ErrorMessageProps) => (
  <span id={id} className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span> {message}
  </span>
);

const BeaconManufacturerInput: FunctionComponent<BeaconManufacturerInputProps> = ({
  isError,
}: BeaconManufacturerInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="manufacturer">Enter your beacon manufacturer</FormLabel>
    {isError && (
      <ErrorMessage
        id={"manufacturer"}
        message={"Please enter a manufacturer"}
      />
    )}
    <Input name="manufacturer" id="manufacturer" />
  </FormGroup>
);

const BeaconModelInput: FunctionComponent<BeaconModelInputProps> = ({
  isError,
}: BeaconModelInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="model">Enter your beacon model</FormLabel>
    {isError && (
      <ErrorMessage id={"model"} message={"Please enter your beacon model"} />
    )}
    <Input name="model" id="model" />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<BeaconHexIdSelectProps> = ({
  isError,
}: BeaconHexIdSelectProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="hexId">Enter the 15 digit beacon HEX ID</FormLabel>
    {isError && (
      <ErrorMessage id={"hexId"} message={"Please enter a valid Hex ID"} />
    )}
    <FormHint forId="hexId">
      This will be on your beacon. It must be 15 characters long and use
      characters 0-9, A-F
    </FormHint>
    <Input name="hexId" id="hexId" htmlAttributes={{ spellCheck: false }} />
    <Details
      summaryText="What does the 15 digit beacon HEX ID look like?"
      className="govuk-!-padding-top-2"
    >
      TODO: Image of a beacon showing hex ID
    </Details>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (context.req.method === "POST") {
    const formData: BeaconCacheEntry = await updateFormCache(context);

    let manufacturerError = false;
    let modelError = false;
    let hexIdError = false;

    if (!formData.manufacturer) {
      manufacturerError = true;
    }

    if (!formData.model) {
      modelError = true;
    }

    if (!formData.hexId) {
      hexIdError = true;
    }

    if (manufacturerError || modelError || hexIdError) {
      return {
        props: {
          manufacturerError,
          modelError,
          hexIdError,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/register-a-beacon/beacon-information",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default CheckBeaconDetails;
