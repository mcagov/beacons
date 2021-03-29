import { GetServerSideProps } from "next";
import React, { FunctionComponent, ReactNode } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { Input } from "../../components/Input";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { Environment, MaritimePleasureVessel, Purpose } from "../../lib/types";

interface OptionsProps {
  form: FormJSON;
  listItemName: string;
}

const definePageForm = ({
  activity,
  otherActivityText,
}: CacheEntry): FormManager => {
  return new FormManager({
    activity: new FieldManager(activity, [
      Validators.required("Maritime pleasure use is a required field"),
    ]),
    otherActivityText: new FieldManager(
      otherActivityText,
      [Validators.required("Other pleasure vessel text is a required field")],
      [
        {
          dependsOn: "activity",
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

  //TODO: These values will be taken from the cache once that's available
  const use = "MARITIME";
  const purpose = "PLEASURE";

  let Options: ReactNode;

  if (use === Environment.MARITIME && purpose === Purpose.PLEASURE) {
    Options = <MaritimePleasureOptions form={form} listItemName={"activity"} />;
  }

  return (
    <BeaconsForm
      previousPageUrl={"/register-a-beacon/beacon-information"}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      errorMessages={form.fields.activity.errorMessages}
    >
      <RadioList conditional={true}>{Options}</RadioList>
    </BeaconsForm>
  );
};

const MaritimePleasureOptions: FunctionComponent<OptionsProps> = ({
  form,
  listItemName,
}: OptionsProps): JSX.Element => {
  return (
    <>
      <RadioListItem
        id="motor-vessel"
        name={listItemName}
        value={MaritimePleasureVessel.MOTOR}
        label="Motor vessel"
        hintText="E.g. Speedboat, RIB"
        defaultChecked={
          form.fields.activity.value === MaritimePleasureVessel.MOTOR
        }
      />
      <RadioListItem
        id="sailing-vessel"
        name={listItemName}
        value={MaritimePleasureVessel.SAILING}
        label="Sailing vessel"
        hintText="E.g. Skiff, Dinghy, Yacht, Catamaran"
        defaultChecked={
          form.fields.activity.value === MaritimePleasureVessel.SAILING
        }
      />
      <RadioListItem
        id="rowing-vessel"
        name={listItemName}
        value={MaritimePleasureVessel.ROWING}
        label="Rowing vessel"
        hintText="E.g. Single person rowing boat, Cornish Gig, Multi-person rowing boat"
        defaultChecked={
          form.fields.activity.value === MaritimePleasureVessel.ROWING
        }
      />
      <RadioListItem
        id="small-unpowered-vessel"
        name={listItemName}
        value={MaritimePleasureVessel.SMALL_UNPOWERED}
        label="Small unpowered vessel"
        hintText="E.g. Canoe, Kayak"
        defaultChecked={
          form.fields.activity.value === MaritimePleasureVessel.SMALL_UNPOWERED
        }
      />
      <RadioListItem
        id="other-pleasure-vessel"
        name={listItemName}
        value={MaritimePleasureVessel.OTHER}
        label="Other pleasure vessel"
        hintText="E.g. Surfboard, Kitesurfing"
        defaultChecked={
          form.fields.activity.value === MaritimePleasureVessel.OTHER
        }
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="What sort of vessel is it?"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
      </RadioListItem>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel",
  definePageForm
);

export default Activity;
