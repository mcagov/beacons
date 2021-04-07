import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { Input } from "../../components/Input";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import { Activity, Environment, Purpose } from "../../lib/registration/types";

interface OptionsProps {
  form: FormJSON;
  listItemName: string;
}

interface ActivityOptionsProps extends OptionsProps {
  environment: string;
  purpose: string;
}

const definePageForm = ({
  activity,
  otherActivityText,
}: FormSubmission): FormManager => {
  return new FormManager({
    activity: new FieldManager(activity, [
      Validators.required("Activity is a required field"),
    ]),
    otherActivityText: new FieldManager(
      otherActivityText,
      [Validators.required("Other activity text is a required field")],
      [
        {
          dependsOn: "activity",
          meetingCondition: (value) => value === Activity.OTHER,
        },
      ]
    ),
  });
};

const ActivityPage: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
  flattenedRegistration,
}: FormPageProps): JSX.Element => {
  const environment = flattenedRegistration.environment;
  const purpose = flattenedRegistration.purpose;

  const pageHeading = `Please select the ${purpose.toLowerCase()} ${environment.toLowerCase()} activity that best describes how the beacon will be used`;
  const insetText = (
    <>
      <GovUKBody>
        This information will help us plan any Search and Rescue response that
        may be required in future.
      </GovUKBody>
      <GovUKBody>
        We will ask you for a full description of any vessels later in the form
      </GovUKBody>
    </>
  );

  return (
    <BeaconsForm
      previousPageUrl="/register-a-beacon/purpose"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      errorMessages={form.fields.activity.errorMessages}
      insetText={insetText}
    >
      <RadioList conditional={true}>
        <ActivityOptions
          environment={environment}
          purpose={purpose}
          form={form}
          listItemName="activity"
        />
      </RadioList>
    </BeaconsForm>
  );
};

export const ActivityOptions: FunctionComponent<ActivityOptionsProps> = ({
  environment,
  purpose,
  form,
  listItemName,
}: ActivityOptionsProps): JSX.Element => {
  if (environment === Environment.MARITIME && purpose === Purpose.PLEASURE)
    return <MaritimePleasureOptions form={form} listItemName={listItemName} />;
  if (environment === Environment.MARITIME && purpose === Purpose.COMMERCIAL)
    return (
      <MaritimeCommercialOptions form={form} listItemName={listItemName} />
    );
  if (environment === Environment.AVIATION && purpose === Purpose.PLEASURE)
    return <AviationPleasureOptions form={form} listItemName={listItemName} />;
  if (environment === Environment.AVIATION && purpose === Purpose.COMMERCIAL)
    return (
      <AviationCommercialOptions form={form} listItemName={listItemName} />
    );

  throw new Error(
    "Environment or purpose not found.  User needs to enter evironment and purpose on previous pages."
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
        value={Activity.MOTOR}
        label="Motor vessel"
        hintText="E.g. Speedboat, Skiff"
        defaultChecked={form.fields.activity.value === Activity.MOTOR}
      />
      <RadioListItem
        id="sailing-vessel"
        name={listItemName}
        value={Activity.SAILING}
        label="Sailing vessel"
        hintText="E.g. Dinghy, Yacht, Catamaran"
        defaultChecked={form.fields.activity.value === Activity.SAILING}
      />
      <RadioListItem
        id="rowing-vessel"
        name={listItemName}
        value={Activity.ROWING}
        label="Rowing vessel"
        hintText="E.g. Rowing boat, Cornish Gig"
        defaultChecked={form.fields.activity.value === Activity.ROWING}
      />
      <RadioListItem
        id="small-unpowered-vessel"
        name={listItemName}
        value={Activity.SMALL_UNPOWERED}
        label="Small unpowered vessel"
        hintText="E.g. Canoe, Kayak"
        defaultChecked={form.fields.activity.value === Activity.SMALL_UNPOWERED}
      />
      <RadioListItem
        id="other-activity"
        name={listItemName}
        value={Activity.OTHER}
        label="Other"
        hintText="E.g. Surfboard, Kitesurfing, Small punt or tender"
        defaultChecked={form.fields.activity.value === Activity.OTHER}
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="Please describe your use"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
      </RadioListItem>
    </>
  );
};

const MaritimeCommercialOptions: FunctionComponent<OptionsProps> = ({
  form,
  listItemName,
}: OptionsProps): JSX.Element => {
  return (
    <>
      <RadioListItem
        id="fishing-vessel"
        name={listItemName}
        value={Activity.FISHING_VESSEL}
        label="Fishing vessel"
        hintText="E.g. Motor or sailing fishing vessel, Guard vessels"
        defaultChecked={form.fields.activity.value === Activity.FISHING_VESSEL}
      />
      <RadioListItem
        id="merchant-vessel"
        name={listItemName}
        value={Activity.MERCHANT_VESSEL}
        label="Merchant vessel"
        hintText="E.g. Pilot vessel, Passenger Ferry, Crew transfer vessel etc"
        defaultChecked={form.fields.activity.value === Activity.MERCHANT_VESSEL}
      />
      <RadioListItem
        id="sailing-vessel"
        name={listItemName}
        value={Activity.SAILING}
        label="Commercial sailing vessel"
        hintText="E.g. Sail training, Hire or Charter vessel, Delivery Skipper etc"
        defaultChecked={form.fields.activity.value === Activity.SAILING}
      />
      <RadioListItem
        id="motor-vessel"
        name={listItemName}
        value={Activity.MOTOR}
        label="Commercial motor pleasure vessel"
        hintText="E.g. Dive boat, Hire or charter vessel, Delivery skipper etc"
        defaultChecked={form.fields.activity.value === Activity.MOTOR}
      />
      <RadioListItem
        id="floating-platform"
        name={listItemName}
        value={Activity.FLOATING_PLATFORM}
        label="Floating platform"
        hintText="E.g. Floating maintenance platform, Lightvessel"
        defaultChecked={
          form.fields.activity.value === Activity.FLOATING_PLATFORM
        }
      />
      <RadioListItem
        id="offshore-windfarm"
        name={listItemName}
        value={Activity.OFFSHORE_WINDFARM}
        label="Offshore windfarm"
        hintText="E.g. Fixed foundation or floating wind turbines"
        defaultChecked={
          form.fields.activity.value === Activity.OFFSHORE_WINDFARM
        }
      />
      <RadioListItem
        id="offshore-rig-platform"
        name={listItemName}
        value={Activity.OFFSHORE_RIG_PLATFORM}
        label="Offshore rig or platform"
        hintText="E.g. An offshore oil rig or fixed drilling platform"
        defaultChecked={
          form.fields.activity.value === Activity.OFFSHORE_RIG_PLATFORM
        }
      />
      <RadioListItem
        id="other-activity"
        name={listItemName}
        value={Activity.OTHER}
        label="Other"
        defaultChecked={form.fields.activity.value === Activity.OTHER}
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="Please describe your use"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
      </RadioListItem>
    </>
  );
};

const AviationPleasureOptions: FunctionComponent<OptionsProps> = ({
  form,
  listItemName,
}: OptionsProps): JSX.Element => {
  return (
    <>
      <RadioListItem
        id="jet-aircraft"
        name={listItemName}
        value={Activity.JET_AIRCRAFT}
        label="Jet aircraft"
        hintText="E.g. very light jet, light business jet, medium or heavy business jet"
        defaultChecked={form.fields.activity.value === Activity.JET_AIRCRAFT}
      />
      <RadioListItem
        id="light-aircraft"
        name={listItemName}
        value={Activity.LIGHT_AIRCRAFT}
        label="Light aircraft"
        hintText="E.g. single engine, twin turboprop, aerobatic"
        defaultChecked={form.fields.activity.value === Activity.LIGHT_AIRCRAFT}
      />
      <RadioListItem
        id="rotor-craft"
        name={listItemName}
        value={Activity.ROTOR_CRAFT}
        label="Rotor craft"
        hintText="E.g. helicopter, gyrocopter"
        defaultChecked={form.fields.activity.value === Activity.ROTOR_CRAFT}
      />
      <RadioListItem
        id="glider"
        name={listItemName}
        value={Activity.GLIDER}
        label="Glider"
        hintText="E.g. microlight, glider, hang glider"
        defaultChecked={form.fields.activity.value === Activity.GLIDER}
      />
      <RadioListItem
        id="hot-air-balloon"
        name={listItemName}
        value={Activity.HOT_AIR_BALLOON}
        label="Hot air balloon"
        defaultChecked={form.fields.activity.value === Activity.HOT_AIR_BALLOON}
      />
      <RadioListItem
        id="other-activity"
        name={listItemName}
        value={Activity.OTHER}
        label="Other"
        defaultChecked={form.fields.activity.value === Activity.OTHER}
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="Please describe your use"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
      </RadioListItem>
    </>
  );
};

const AviationCommercialOptions: FunctionComponent<OptionsProps> = ({
  form,
  listItemName,
}: OptionsProps): JSX.Element => {
  return (
    <>
      <RadioListItem
        id="passenger-plane"
        name={listItemName}
        value={Activity.PASSENGER_PLANE}
        label="Passenger airplane"
        hintText="E.g. jumbo passenger jet, mid size passenger jet, light passenger jet, turbopop passenger plan"
        defaultChecked={form.fields.activity.value === Activity.PASSENGER_PLANE}
      />
      <RadioListItem
        id="jet-aircraft"
        name={listItemName}
        value={Activity.JET_AIRCRAFT}
        label="Jet aircraft"
        hintText="E.g. very light jet, light business jet, medium or heavy business jet"
        defaultChecked={form.fields.activity.value === Activity.JET_AIRCRAFT}
      />
      <RadioListItem
        id="cargo-airplane"
        name={listItemName}
        value={Activity.CARGO_AIRPLANE}
        label="Cargo airplane"
        defaultChecked={form.fields.activity.value === Activity.CARGO_AIRPLANE}
      />
      <RadioListItem
        id="light-aircraft"
        name={listItemName}
        value={Activity.LIGHT_AIRCRAFT}
        label="Light aircraft"
        hintText="E.g. microlight, glider, hang glider"
        defaultChecked={form.fields.activity.value === Activity.GLIDER}
      />
      <RadioListItem
        id="glider"
        name={listItemName}
        value={Activity.GLIDER}
        label="Glider"
        hintText="E.g. microlight, glider, hang glider"
        defaultChecked={form.fields.activity.value === Activity.GLIDER}
      />
      <RadioListItem
        id="hot-air-balloon"
        name={listItemName}
        value={Activity.HOT_AIR_BALLOON}
        label="Hot air balloon"
        defaultChecked={form.fields.activity.value === Activity.HOT_AIR_BALLOON}
      />
      <RadioListItem
        id="other-activity"
        name={listItemName}
        value={Activity.OTHER}
        label="Other"
        hintText="E.g. paragliding"
        defaultChecked={form.fields.activity.value === Activity.OTHER}
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="Please describe your use"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
      </RadioListItem>
    </>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = (context) => {
  const flattenedRegistration = context.registration.getFlattenedRegistration({
    useIndex: context.useIndex,
  });
  const environment = flattenedRegistration.environment;

  switch (environment) {
    case Environment.MARITIME:
      return "/register-a-beacon/about-the-vessel";
    case Environment.AVIATION:
      return "/register-a-beacon/about-the-aircraft";
    case null:
      return "/register-a-beacon/beacon-use";
    default:
      throw new Error(`Error: unrecognised environment ${environment}`);
  }
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/about-the-vessel",
  definePageForm,
  (formData) => formData,
  onSuccessfulFormCallback
);

export default ActivityPage;
