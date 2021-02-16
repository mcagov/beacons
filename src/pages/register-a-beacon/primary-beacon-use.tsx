import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import {
  Form,
  FormFieldset,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { RadioList, RadioListItemHint } from "../../components/RadioList";
import { withCookieRedirect } from "../../lib/middleware";

const PrimaryBeaconUse: FunctionComponent = () => (
  <Layout
    navigation={<BackButton href="/register-a-beacon/beacon-information" />}
  >
    <Grid
      mainContent={
        <>
          <BeaconUseForm />

          <IfYouNeedHelp />
        </>
      }
    />
  </Layout>
);

const BeaconUseForm: FunctionComponent = () => (
  <Form action="/register-a-beacon/primary-beacon-use">
    <FormFieldset>
      <FormLegendPageHeading>
        What type of maritime pleasure vessel will you mostly use this beacon
        on?
      </FormLegendPageHeading>
    </FormFieldset>

    <RadioList>
      <RadioListItemHint
        id="motor-vessel"
        name="use"
        value=""
        hintText="E.g. Speedboat, RIB"
      >
        Motor vessel
      </RadioListItemHint>

      <RadioListItemHint
        id="sailing-vessel"
        name="use"
        value=""
        hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
      >
        Sailing vessel
      </RadioListItemHint>

      <RadioListItemHint
        id="rowing-vessel"
        name="use"
        value=""
        hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
      >
        Rowing vessel
      </RadioListItemHint>

      <RadioListItemHint
        id="other-pleasure-vessel"
        name="use"
        value=""
        hintText="E.g. Surfboard, Kitesurfing,  Canoe, Kayak"
      >
        Small unpowered vessel
      </RadioListItemHint>
    </RadioList>

    <Button buttonText="Continue" />
  </Form>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default PrimaryBeaconUse;
