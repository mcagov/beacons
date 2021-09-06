import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { Input } from "../../components/Input";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import {
  Activity,
  Environment,
  Purpose,
} from "../../lib/deprecatedRegistration/types";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { CreateRegistrationPageURLs, queryParams } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { makeDraftRegistrationMapper } from "../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { IfUserDoesNotHaveValidSession } from "../../router/rules/IfUserDoesNotHaveValidSession";
import { IfUserHasNotSpecifiedAUse } from "../../router/rules/IfUserHasNotSpecifiedAUse";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";

interface ActivityForm {
  environment: string;
  activity: string;
  otherActivityText: string;
  otherActivityLocation: string;
  otherActivityPeopleCount: string;
  workingRemotelyLocation: string;
  workingRemotelyPeopleCount: string;
  windfarmLocation: string;
  windfarmPeopleCount: string;
}

interface ActivityPageProps extends DraftRegistrationPageProps {
  environment: Environment;
  purpose: Purpose;
  useIndex: number;
}

const ActivityPage: FunctionComponent<ActivityPageProps> = ({
  form,
  showCookieBanner,
  environment,
  purpose,
  useIndex,
}: ActivityPageProps): JSX.Element => {
  const pageHeading = `Please select the ${
    environment === Environment.LAND
      ? environment.toLowerCase()
      : purpose.toLowerCase() + " " + environment.toLowerCase()
  } activity that best describes how the beacon will be used`;

  const pageText = (
    <>
      <GovUKBody>
        This information will help us plan any Search and Rescue response that
        may be required in future.
      </GovUKBody>
      {environment === Environment.MARITIME && (
        <GovUKBody>
          We will ask you for a full description of any vessels later in the
          form.
        </GovUKBody>
      )}
    </>
  );

  return (
    <BeaconsForm
      previousPageUrl={
        (environment === Environment.LAND
          ? CreateRegistrationPageURLs.environment
          : CreateRegistrationPageURLs.purpose) + queryParams({ useIndex })
      }
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      errorMessages={form.fields.activity.errorMessages}
    >
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        {pageText}
        <RadioList conditional={true}>
          <ActivityOptions
            environment={environment}
            purpose={purpose}
            form={form}
            listItemName="activity"
          />
        </RadioList>
      </BeaconsFormFieldsetAndLegend>
      <input type="hidden" name="environment" value={environment} />
    </BeaconsForm>
  );
};

interface OptionsProps {
  form: FormJSON;
  listItemName: string;
}

interface ActivityOptionsProps extends OptionsProps {
  environment: string;
  purpose: string;
}

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
  if (environment === Environment.LAND)
    return <LandOptions form={form} listItemName={listItemName} />;

  throw new Error(
    "Environment or purpose not found.  User needs to enter environment and purpose on previous pages."
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

const LandOptions: FunctionComponent<OptionsProps> = ({
  form,
  listItemName,
}: OptionsProps) => {
  return (
    <RadioList conditional={true}>
      <RadioListItem
        id="driving"
        name={listItemName}
        value={Activity.DRIVING}
        defaultChecked={form.fields.activity.value === Activity.DRIVING}
        label="Driving"
      />
      <RadioListItem
        id="cycling"
        name={listItemName}
        value={Activity.CYCLING}
        defaultChecked={form.fields.activity.value === Activity.CYCLING}
        label="Cycling"
      />
      <RadioListItem
        id="climbing-mountaineering"
        name={listItemName}
        value={Activity.CLIMBING_MOUNTAINEERING}
        defaultChecked={
          form.fields.activity.value === Activity.CLIMBING_MOUNTAINEERING
        }
        label="Climbing or mountaineering"
      />
      <RadioListItem
        id="skiing"
        name={listItemName}
        value={Activity.SKIING}
        defaultChecked={form.fields.activity.value === Activity.SKIING}
        label="Skiing"
      />
      <RadioListItem
        id="walking-hiking"
        name={listItemName}
        value={Activity.WALKING_HIKING}
        defaultChecked={form.fields.activity.value === Activity.WALKING_HIKING}
        label="Walking or hiking"
      />
      <RadioListItem
        id="working-remotely"
        name={listItemName}
        value={Activity.WORKING_REMOTELY}
        defaultChecked={
          form.fields.activity.value === Activity.WORKING_REMOTELY
        }
        label="Working remotely"
        hintText="E.g. forestry worker, estate manager, tree surgeon, engineer, council worker"
        conditional={true}
      >
        <FormGroup
          errorMessages={form.fields.workingRemotelyLocation.errorMessages}
        >
          <Input
            id="workingRemotelyLocation"
            label="Where will you be using the beacon?"
            hintText="You can enter a place name, area, or latitude and longitude"
            defaultValue={form.fields.workingRemotelyLocation.value}
          />
        </FormGroup>
        <FormGroup
          errorMessages={form.fields.workingRemotelyPeopleCount.errorMessages}
        >
          <Input
            id="workingRemotelyPeopleCount"
            label="What is the typical/maximum number of people with you?"
            defaultValue={form.fields.workingRemotelyPeopleCount.value}
          />
        </FormGroup>
      </RadioListItem>
      <RadioListItem
        id="windfarm"
        name={listItemName}
        value={Activity.WINDFARM}
        defaultChecked={form.fields.activity.value === Activity.WINDFARM}
        label="Working on a windfarm"
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.windfarmLocation.errorMessages}>
          <Input
            id="windfarmLocation"
            label="Where will you be using the beacon?"
            hintText="You can enter a place name, area, or latitude and longitude"
            defaultValue={form.fields.windfarmLocation.value}
          />
        </FormGroup>
        <FormGroup
          errorMessages={form.fields.windfarmPeopleCount.errorMessages}
        >
          <Input
            id="windfarmPeopleCount"
            label="What is the typical/maximum number of people with you?"
            defaultValue={form.fields.windfarmPeopleCount.value}
          />
        </FormGroup>
      </RadioListItem>
      <RadioListItem
        id="other-activity"
        name={listItemName}
        value={Activity.OTHER}
        defaultChecked={form.fields.activity.value === Activity.OTHER}
        label="Other"
        conditional={true}
      >
        <FormGroup errorMessages={form.fields.otherActivityText.errorMessages}>
          <Input
            id="otherActivityText"
            label="Please describe your use"
            defaultValue={form.fields.otherActivityText.value}
          />
        </FormGroup>
        <FormGroup
          errorMessages={form.fields.otherActivityLocation.errorMessages}
        >
          <Input
            id="otherActivityLocation"
            label="Where will you be using your beacon?"
            hintText="You can enter a place name, area or latitude and longitude"
            defaultValue={form.fields.otherActivityLocation.value}
          />
        </FormGroup>
        <FormGroup
          errorMessages={form.fields.otherActivityPeopleCount.errorMessages}
        >
          <Input
            id="otherActivityPeopleCount"
            label="What is the typical/max number of people with you?"
            defaultValue={form.fields.otherActivityPeopleCount.value}
          />
        </FormGroup>
      </RadioListItem>
    </RadioList>
  );
};

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
      new IfUserHasNotSpecifiedAUse(context),
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<ActivityForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<ActivityForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new IfUserSubmittedValidRegistrationForm<ActivityForm>(
        context,
        validationRules,
        mapper(context),
        await nextPage(context)
      ),
    ]).execute();
  })
);

const nextPage = async (
  context: BeaconsGetServerSidePropsContext
): Promise<CreateRegistrationPageURLs> => {
  const environment = (
    await context.container.getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    )
  ).uses[context.query.useIndex as string]?.environment;

  switch (environment) {
    case Environment.MARITIME:
      return CreateRegistrationPageURLs.aboutTheVessel;
    case Environment.AVIATION:
      return CreateRegistrationPageURLs.aboutTheAircraft;
    case Environment.LAND:
      return CreateRegistrationPageURLs.landCommunications;
    default:
      return CreateRegistrationPageURLs.environment;
  }
};

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<ActivityPageProps>> => {
  const use: DraftBeaconUse = (
    await context.container.getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    )
  ).uses[context.query.useIndex as string];

  return {
    environment: (use?.environment as Environment) || null,
    purpose: (use?.purpose as Purpose) || null,
    useIndex: parseInt(context.query.useIndex as string),
  };
};

const mapper = (
  context: BeaconsGetServerSidePropsContext
): DraftRegistrationFormMapper<ActivityForm> => {
  const beaconUseMapper: BeaconUseFormMapper<ActivityForm> = {
    formToDraftBeaconUse: (form) => {
      return {
        environment: form.environment || "",
        activity: form.activity || "",
        otherActivityText: form.otherActivityText || "",
        otherActivityLocation: form.otherActivityLocation || "",
        otherActivityPeopleCount: form.otherActivityPeopleCount || "",
        workingRemotelyLocation: form.workingRemotelyLocation || "",
        workingRemotelyPeopleCount: form.workingRemotelyPeopleCount || "",
        windfarmLocation: form.windfarmLocation || "",
        windfarmPeopleCount: form.windfarmPeopleCount || "",
      };
    },
    beaconUseToForm: (draftRegistration) => ({
      environment: draftRegistration.environment || "",
      activity: draftRegistration.activity || "",
      otherActivityText: draftRegistration.otherActivityText || "",
      otherActivityLocation: draftRegistration.otherActivityLocation || "",
      otherActivityPeopleCount:
        draftRegistration.otherActivityPeopleCount || "",
      workingRemotelyLocation: draftRegistration.workingRemotelyLocation || "",
      workingRemotelyPeopleCount:
        draftRegistration.workingRemotelyPeopleCount || "",
      windfarmLocation: draftRegistration.windfarmLocation || "",
      windfarmPeopleCount: draftRegistration.windfarmPeopleCount || "",
      purpose: draftRegistration.purpose,
    }),
  };

  const useIndex = parseInt(context.query.useIndex as string);

  return makeDraftRegistrationMapper<ActivityForm>(useIndex, beaconUseMapper);
};

const validationRules = ({
  environment,
  activity,
  otherActivityText,
  otherActivityLocation,
  otherActivityPeopleCount,
  workingRemotelyLocation,
  workingRemotelyPeopleCount,
  windfarmLocation,
  windfarmPeopleCount,
  purpose,
}: FormSubmission): FormManager => {
  const activityMatchingCondition = (activity: Activity) => ({
    dependsOn: "activity",
    meetingCondition: (value: Activity) => value === activity,
  });

  const environmentIsLandMatchingCondition = {
    dependsOn: "environment",
    meetingCondition: (value: Environment) => value === Environment.LAND,
  };

  fieldToFocus(environment, purpose);

  return new FormManager({
    environment: new FieldManager(environment),
    activity: new FieldManager(
      activity,
      [Validators.required("Activity is a required field")],
      [],
      fieldToFocus(environment, purpose)
    ),
    otherActivityText: new FieldManager(
      otherActivityText,
      [Validators.required("Enter a description for your activity")],
      [activityMatchingCondition(Activity.OTHER)]
    ),
    otherActivityLocation: new FieldManager(
      otherActivityLocation,
      [Validators.required("Enter where you use your beacon")],
      [
        activityMatchingCondition(Activity.OTHER),
        environmentIsLandMatchingCondition,
      ]
    ),
    otherActivityPeopleCount: new FieldManager(
      otherActivityPeopleCount,
      [
        Validators.required(
          "Enter how many people tend to be with you when you use your beacon"
        ),
        Validators.wholeNumber(
          "Enter a whole number for the typical/maximum number of people that tend to be with you when you use your beacon"
        ),
      ],
      [
        activityMatchingCondition(Activity.OTHER),
        environmentIsLandMatchingCondition,
      ]
    ),
    workingRemotelyLocation: new FieldManager(
      workingRemotelyLocation,
      [Validators.required("Enter the location where you work remotely")],
      [activityMatchingCondition(Activity.WORKING_REMOTELY)]
    ),
    workingRemotelyPeopleCount: new FieldManager(
      workingRemotelyPeopleCount,
      [
        Validators.required(
          "Enter how many people tend to be with you when you work remotely"
        ),
        Validators.wholeNumber(
          "Enter a whole number for the typical/maximum number of people that tend to be with you when you work remotely"
        ),
      ],
      [activityMatchingCondition(Activity.WORKING_REMOTELY)]
    ),
    windfarmLocation: new FieldManager(
      windfarmLocation,
      [Validators.required("Enter the location of the windfarm")],
      [activityMatchingCondition(Activity.WINDFARM)]
    ),
    windfarmPeopleCount: new FieldManager(
      windfarmPeopleCount,
      [
        Validators.required(
          "Enter how many people tend to be with you when you work at a windfarm"
        ),
        Validators.wholeNumber(
          "Enter a whole number for the typical/maximum number of people that tend to be with you are at the windfarm"
        ),
      ],
      [activityMatchingCondition(Activity.WINDFARM)]
    ),
  });
};

const fieldToFocus = (
  environment: Environment | undefined,
  purpose: Purpose | undefined
) => {
  switch (environment) {
    case Environment.MARITIME:
      if (purpose === Purpose.COMMERCIAL) {
        return "fishing-vessel";
      }
      return "motor-vessel";
    case Environment.AVIATION:
      if (purpose === Purpose.COMMERCIAL) {
        return "passenger-plane";
      }
      return "jet-aircraft";
    case Environment.LAND:
      return "driving";
  }
};

export default ActivityPage;
