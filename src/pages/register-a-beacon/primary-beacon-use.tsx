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
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { handlePageRequest } from "../../lib/handlePageRequest";
import { MaritimePleasureVessel } from "../../lib/types";

interface PrimaryBeaconUseProps {
  formData: CacheEntry;
  needsValidation: boolean;
}

interface BeaconUseFormProps {
  formGroup: FieldManager;
}

const getFormGroup = ({
  maritimePleasureVesselUse,
  otherPleasureVesselText,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    maritimePleasureVesselUse: new FieldInput(maritimePleasureVesselUse, [
      Validators.required("Maritime pleasure use is a required field"),
    ]),
    otherPleasureVesselText: new FieldInput(otherPleasureVesselText, [
      Validators.conditionalOnValue(
        "Other pleasure vessel must not be empty",
        "maritimePleasureVesselUse",
        MaritimePleasureVessel.OTHER,
        Validators.required("").hasErrorFn
      ),
    ]),
  });
};

const PrimaryBeaconUse: FunctionComponent<PrimaryBeaconUseProps> = ({
  formData,
  needsValidation = false,
}: PrimaryBeaconUseProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }

  return (
    <Layout
      title={
        "What type of maritime pleasure vessel will you mostly use this beacon on?"
      }
      navigation={<BackButton href="/register-a-beacon/beacon-information" />}
      pageHasErrors={formGroup.hasErrors()}
    >
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={formGroup.errorSummary()} />
            <BeaconUseForm formGroup={formGroup} />

            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const BeaconUseForm: FunctionComponent<BeaconUseFormProps> = ({
  formGroup,
}: BeaconUseFormProps): JSX.Element => {
  const setCheckedIfUserSelected = (userSelectedValue, componentValue) => {
    return {
      defaultChecked: userSelectedValue === componentValue,
    };
  };
  const controls = formGroup.controls;
  const checkedValue = controls.maritimePleasureVesselUse.value;

  return (
    <Form action="/register-a-beacon/primary-beacon-use">
      <FormGroup
        errorMessages={controls.maritimePleasureVesselUse.errorMessages()}
      >
        <FormFieldset>
          <FormLegendPageHeading>
            What type of maritime pleasure vessel will you mostly use this
            beacon on?
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
                id="otherPleasureVesselText"
                label="What sort of vessel is it?"
                defaultValue={controls.otherPleasureVesselText.value}
              />
            </FormGroup>
          </RadioListItemConditional>
        </RadioListConditional>
      </FormGroup>

      <Button buttonText="Continue" />
    </Form>
  );
};

const ensureMaritimePleasureVesselUseIsSubmitted = (formData) => {
  return {
    ...formData,
    maritimePleasureVesselUse: formData["maritimePleasureVesselUse"] || "",
  };
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel",
  getFormGroup,
  ensureMaritimePleasureVesselUseIsSubmitted
);

export default PrimaryBeaconUse;
