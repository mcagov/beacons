import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
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
import { VesselCacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import { handlePageRequest } from "../../lib/handlePageRequest";
import { MaritimePleasureVessel } from "../../lib/types";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface PrimaryBeaconUseProps {
  formData: VesselCacheEntry;
  needsValidation: boolean;
}

const PrimaryBeaconUse: FunctionComponent<PrimaryBeaconUseProps> = ({
  formData,
  needsValidation = false,
}: PrimaryBeaconUseProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "maritimePleasureVesselUse",
    "otherPleasureVesselText"
  );

  const errors = FormValidator.errorSummary(formData);

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/beacon-information" />}
    >
      <Grid
        mainContent={
          <>
            {needsValidation && <FormErrorSummary errors={errors} />}
            <BeaconUseForm checkedValue={formData.maritimePleasureVesselUse} />

            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

interface BeaconUseFormProps {
  checkedValue: string | null;
}

const BeaconUseForm: FunctionComponent<BeaconUseFormProps> = ({
  checkedValue = null,
}: BeaconUseFormProps): JSX.Element => {
  const setCheckedIfUserSelected = (userSelectedValue, componentValue) => {
    return {
      defaultChecked: userSelectedValue === componentValue,
    };
  };

  return (
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
          inputHtmlAttributes={setCheckedIfUserSelected(
            checkedValue,
            MaritimePleasureVessel.MOTOR
          )}
        >
          Motor vessel
        </RadioListItemHint>
        <RadioListItemHint
          id="sailing-vessel"
          name="maritimePleasureVesselUse"
          value={MaritimePleasureVessel.SAILING}
          hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
          inputHtmlAttributes={setCheckedIfUserSelected(
            checkedValue,
            MaritimePleasureVessel.SAILING
          )}
        >
          Sailing vessel
        </RadioListItemHint>
        <RadioListItemHint
          id="rowing-vessel"
          name="maritimePleasureVesselUse"
          value={MaritimePleasureVessel.ROWING}
          hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
          inputHtmlAttributes={setCheckedIfUserSelected(
            checkedValue,
            MaritimePleasureVessel.ROWING
          )}
        >
          Rowing vessel
        </RadioListItemHint>
        <RadioListItemHint
          id="small-unpowered-vessel"
          name="maritimePleasureVesselUse"
          value={MaritimePleasureVessel.SMALL_UNPOWERED}
          hintText="E.g. Canoe, Kayak"
          inputHtmlAttributes={setCheckedIfUserSelected(
            checkedValue,
            MaritimePleasureVessel.SMALL_UNPOWERED
          )}
        >
          Small unpowered vessel
        </RadioListItemHint>
        <RadioListItemHint
          id="other-pleasure-vessel"
          name="maritimePleasureVesselUse"
          value={MaritimePleasureVessel.OTHER}
          hintText="E.g. Surfboard, Kitesurfing"
          inputHtmlAttributes={{
            ...{
              "data-aria-controls": "conditional-other-pleasure-vessel",
            },
            ...setCheckedIfUserSelected(
              checkedValue,
              MaritimePleasureVessel.OTHER
            ),
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
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel"
);

export default PrimaryBeaconUse;
