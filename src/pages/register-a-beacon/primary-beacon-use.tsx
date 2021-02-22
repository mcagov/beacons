import { GetServerSideProps, GetServerSidePropsContext } from "next";
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
import {
  RadioListConditional,
  RadioListItemConditional,
  RadioListItemHint,
} from "../../components/RadioList";
import { BeaconCacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import { updateFormCache, withCookieRedirect } from "../../lib/middleware";
import { MaritimePleasureVessel } from "../../lib/types";

const PrimaryBeaconUse: FunctionComponent = (): JSX.Element => (
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

const BeaconUseForm: FunctionComponent = (): JSX.Element => (
  <Form action="/register-a-beacon/primary-beacon-use">
    <FormFieldset>
      <FormLegendPageHeading>
        What type of maritime pleasure vessel will you mostly use this beacon
        on?
      </FormLegendPageHeading>
    </FormFieldset>
    <RadioListConditional>
      <RadioListItemHint
        id="motor-vessel"
        name="maritimePleasureVesselUse"
        value={MaritimePleasureVessel.MOTOR}
        hintText="E.g. Speedboat, RIB"
      >
        Motor vessel
      </RadioListItemHint>
      <RadioListItemHint
        id="sailing-vessel"
        name="maritimePleasureVesselUse"
        value={MaritimePleasureVessel.SAILING}
        hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
      >
        Sailing vessel
      </RadioListItemHint>
      <RadioListItemHint
        id="rowing-vessel"
        name="maritimePleasureVesselUse"
        value={MaritimePleasureVessel.ROWING}
        hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
      >
        Rowing vessel
      </RadioListItemHint>
      <RadioListItemHint
        id="small-unpowered-vessel"
        name="maritimePleasureVesselUse"
        value={MaritimePleasureVessel.SMALL_UNPOWERED}
        hintText="E.g. Canoe, Kayak"
      >
        Small unpowered vessel
      </RadioListItemHint>
      <RadioListItemHint
        id="other-pleasure-vessel"
        name="maritimePleasureVesselUse"
        value={MaritimePleasureVessel.OTHER}
        hintText="E.g. Surfboard, Kitesurfing"
        inputHtmlAttributes={{
          "data-aria-controls": "conditional-other-pleasure-vessel",
        }}
      >
        Other pleasure vessel
      </RadioListItemHint>
      <RadioListItemConditional id="conditional-other-pleasure-vessel">
        <FormGroup>
          <Input
            id="other-pleasure-vessel-text"
            name="otherPleasureVesselText"
            label="What sort of vessel is it?"
          />
        </FormGroup>
      </RadioListItemConditional>
    </RadioListConditional>

    <Button buttonText="Continue" />
  </Form>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const formData: BeaconCacheEntry = await updateFormCache(context);

    const userDidSubmitForm = context.req.method === "POST";
    const formIsValid = !FormValidator.hasErrors(formData);

    if (userDidSubmitForm && formIsValid) {
      return {
        redirect: {
          statusCode: 303,
          destination: "/register-a-beacon/about-the-vessel",
        },
      };
    }

    return {
      props: {
        formData,
        needsValidation: userDidSubmitForm,
      },
    };
  }
);

export default PrimaryBeaconUse;
