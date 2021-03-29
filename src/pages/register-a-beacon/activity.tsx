import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { Input } from "../../components/Input";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { MaritimePleasureVessel } from "../../lib/types";

interface OptionsProps {
  form: FormJSON;
}

const definePageForm = ({
  maritimePleasureVesselUse,
  otherPleasureVesselText,
}: CacheEntry): FormManager => {
  return new FormManager({
    maritimePleasureVesselUse: new FieldManager(maritimePleasureVesselUse, [
      Validators.required("Maritime pleasure use is a required field"),
    ]),
    otherPleasureVesselText: new FieldManager(
      otherPleasureVesselText,
      [Validators.required("Other pleasure vessel text is a required field")],
      [
        {
          dependsOn: "maritimePleasureVesselUse",
          meetingCondition: (value) => value === MaritimePleasureVessel.OTHER,
        },
      ]
    ),
  });
};

const Activity: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading =
    "What type of maritime pleasure vessel will you mostly use this beacon on?";

  return (
    <BeaconsForm
      previousPageUrl="/register-a-beacon/beacon-information"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      errorMessages={form.fields.maritimePleasureVesselUse.errorMessages}
    >
      <MaritimePleasureOptions form={form} />
    </BeaconsForm>
  );
};

const MaritimePleasureOptions: FunctionComponent<OptionsProps> = ({
  form,
}: OptionsProps): JSX.Element => {
  const maritimePleasureVesselName = "maritimePleasureVesselUse";

  return (
    <RadioList conditional={true}>
      <RadioListItem
        id="motor-vessel"
        name={maritimePleasureVesselName}
        value={MaritimePleasureVessel.MOTOR}
        label="Motor vessel"
        hintText="E.g. Speedboat, RIB"
        defaultChecked={
          form.fields.maritimePleasureVesselUse.value ===
          MaritimePleasureVessel.MOTOR
        }
      />
      <RadioListItem
        id="sailing-vessel"
        name={maritimePleasureVesselName}
        value={MaritimePleasureVessel.SAILING}
        label="Sailing vessel"
        hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
        defaultChecked={
          form.fields.maritimePleasureVesselUse.value ===
          MaritimePleasureVessel.SAILING
        }
      />
      <RadioListItem
        id="rowing-vessel"
        name={maritimePleasureVesselName}
        value={MaritimePleasureVessel.ROWING}
        label="Rowing vessel"
        hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
        defaultChecked={
          form.fields.maritimePleasureVesselUse.value ===
          MaritimePleasureVessel.ROWING
        }
      />
      <RadioListItem
        id="small-unpowered-vessel"
        value={MaritimePleasureVessel.SMALL_UNPOWERED}
        label="Small unpowered vessel"
        hintText="E.g. Canoe, Kayak"
        defaultChecked={
          form.fields.maritimePleasureVesselUse.value ===
          MaritimePleasureVessel.SMALL_UNPOWERED
        }
      />
      <RadioListItem
        id="other-pleasure-vessel"
        name={maritimePleasureVesselName}
        value={MaritimePleasureVessel.OTHER}
        label="Other pleasure vessel"
        hintText="E.g. Surfboard, Kitesurfing"
        defaultChecked={
          form.fields.maritimePleasureVesselUse.value ===
          MaritimePleasureVessel.OTHER
        }
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.otherPleasureVesselText.errorMessages}
        >
          <Input
            id="otherPleasureVesselText"
            label="What sort of vessel is it?"
            defaultValue={form.fields.otherPleasureVesselText.value}
          />
        </FormGroup>
      </RadioListItem>
    </RadioList>
  );
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel",
  definePageForm
);

export default Activity;
