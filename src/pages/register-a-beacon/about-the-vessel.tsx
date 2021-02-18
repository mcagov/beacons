import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegendPageHeading,
  FormLabel,
  FormGroup,
  FormHint,
} from "../../components/Form";
import { IfYouNeedHelp } from "../../components/Mca";
import { GetServerSideProps } from "next";
import { withCookieRedirect } from "../../lib/middleware";
import { TextAreaCharacterCount } from "../../components/TextArea";

const AboutTheVessel: FunctionComponent = (): JSX.Element => {
  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/primary-beacon-use" />}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/about-the-vessel">
                <FormFieldset>
                  <FormLegendPageHeading>
                    About the pleasure vessel
                  </FormLegendPageHeading>

                  <MaxCapacityInput />

                  <VesselNameInput />

                  <HomeportInput />

                  <AreaOfOperationTextArea />

                  <BeaconLocationInput />
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
};

const MaxCapacityInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="maxCapacity">
      Enter the maximum number of persons aboard
    </FormLabel>
    <FormHint forId="maxCapacity">
      Knowing the maximum number of persons likely to be onboard the vessel
      helps Search & Rescue know how many people to look for and what resources
      to send
    </FormHint>
    <Input
      name="maxCapacity"
      id="maxCapacity"
      numOfChars={5}
      htmlAttributes={{
        spellCheck: "false",
        "aria-describedby": "maxCapacity-hint",
        pattern: "[0-9]*",
        inputMode: "numeric",
      }}
    />
  </FormGroup>
);

const VesselNameInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="vesselName">
      Enter your vessel name (optional)
    </FormLabel>
    <Input
      name="vesselName"
      id="vesselName"
      htmlAttributes={{ spellCheck: false }}
    />
  </FormGroup>
);

const HomeportInput: FunctionComponent = (): JSX.Element => (
  <FormGroup>
    <FormLabel htmlFor="homeport">
      Enter the Homeport for the vessel (optional)
    </FormLabel>
    <FormHint forId="homeport">
      This is the name of the port where your vessel is registered and primarily
      operates from
    </FormHint>
    <Input
      name="homeport"
      id="homeport"
      htmlAttributes={{ spellCheck: false }}
    />
  </FormGroup>
);

const AreaOfOperationTextArea: FunctionComponent = (): JSX.Element => (
  <TextAreaCharacterCount
    name="areaOfOperation"
    id="areaOfOperation"
    maxCharacters={250}
    rows={4}
  >
    <FormGroup>
      <FormLabel htmlFor="areaOfOperation">
        Tell us about the typical area of operation (optional)
      </FormLabel>
      <FormHint forId="areaOfOperation">
        Typical areas of operation for the vessel is very helpful in assisting
        Search & Rescue. For example &quot;Whitesands Bay, St Davids,
        Pembrokeshire&quot;
      </FormHint>
    </FormGroup>
  </TextAreaCharacterCount>
);

const BeaconLocationInput: FunctionComponent = (): JSX.Element => (
  <TextAreaCharacterCount
    name="beaconLocation"
    id="beaconLocation"
    maxCharacters={100}
    rows={3}
  >
    <FormGroup>
      <FormLabel htmlFor="beaconLocation">
        Tell us about the typical area of operation (optional)
      </FormLabel>
      <FormHint forId="beaconLocation">
        E.g. will the beacon be attached to a life jacket, stowed inside the
        cabin, in a grab bag etc?
      </FormHint>
    </FormGroup>
  </TextAreaCharacterCount>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default AboutTheVessel;
