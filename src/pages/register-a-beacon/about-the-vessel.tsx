import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { TextareaCharacterCount } from "../../components/Textarea";
import { withCookieRedirect } from "../../lib/middleware";

const AboutTheVessel: FunctionComponent = (): JSX.Element => {
  const pageHeading = "About the pleasure vessel";

  // TODO: Use form validation to set this
  const pageHasErrors = false;
  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/primary-beacon-use" />}
        title={pageHeading}
        pageHasErrors={pageHasErrors}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/about-the-vessel">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MaxCapacityInput />

                  <VesselNameInput />

                  <HomeportInput />

                  <AreaOfOperationTextArea />

                  <BeaconLocationInput />
                </FormFieldset>
                <Button buttonText="Continue" />
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    </>
  );
};

const MaxCapacityInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <Input
      id="maxCapacity"
      label="Enter the maximum number of persons aboard"
      hintText="Knowing the maximum number of persons likely to be onboard the vessel helps Search and Rescue know how many people to look for and what resources to send"
      numOfChars={5}
      htmlAttributes={{
        pattern: "[0-9]*",
        inputMode: "numeric",
      }}
    />
  </FormGroup>
);

const VesselNameInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <Input id="vesselName" label="Enter your vessel name (optional)" />
  </FormGroup>
);

const HomeportInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <Input
      id="homeport"
      label="Enter the Homeport for the vessel (optional)"
      hintText="This is the name of the port where your vessel is registered and primarily operates from"
    />
  </FormGroup>
);

const AreaOfOperationTextArea: FunctionComponent = (): JSX.Element => (
  <TextareaCharacterCount
    id="areaOfOperation"
    label="Tell us about the typical area of operation (optional)"
    hintText="Typical areas of operation for the vessel is very helpful in assisting Search & Rescue. For example 'Whitesands Bay, St Davids, Pembrokeshire'"
    maxCharacters={250}
    rows={4}
  />
);

const BeaconLocationInput: FunctionComponent = (): JSX.Element => (
  <TextareaCharacterCount
    id="beaconLocation"
    label="Tell us about the typical area of operation (optional)"
    hintText="E.g. will the beacon be attached to a life jacket, stowed inside the
    cabin, in a grab bag etc?"
    maxCharacters={100}
    rows={3}
  />
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default AboutTheVessel;
