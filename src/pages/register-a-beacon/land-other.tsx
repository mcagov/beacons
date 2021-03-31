import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButtonRouterIndexes, Button } from "../../components/Button";
import { CheckboxList, CheckboxListItem } from "../../components/Checkbox";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegend,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { Activity } from "../../lib/registration/types";

const definePageForm = ({
  driving,
  cycling,
  climbingMountaineering,
  skiing,
  walkingHiking,
  workingRemotely,
  workingRemotelyLocation,
  workingRemotelyPeopleCount,
  windfarm,
  windfarmLocation,
  windfarmPeopleCount,
  otherActivity,
  otherActivityDescription,
  otherActivityLocation,
  otherActivityPeopleCount,
}: FormSubmission): FormManager => {
  return new FormManager({
    driving: new FieldManager(driving),
    cycling: new FieldManager(cycling),
    climbingMountaineering: new FieldManager(climbingMountaineering),
    skiing: new FieldManager(skiing),
    walkingHiking: new FieldManager(walkingHiking),
    workingRemotely: new FieldManager(workingRemotely),
    workingRemotelyLocation: new FieldManager(
      workingRemotelyLocation,
      [Validators.required("Enter the location where you work remotely")],
      [
        {
          dependsOn: "workingRemotely",
          meetingCondition: (value) => value === Activity.WORKING_REMOTELY,
        },
      ]
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
      [
        {
          dependsOn: "workingRemotely",
          meetingCondition: (value) => value === Activity.WORKING_REMOTELY,
        },
      ]
    ),
    windfarm: new FieldManager(windfarm),
    windfarmLocation: new FieldManager(
      windfarmLocation,
      [Validators.required("Enter the location of the windfarm")],
      [
        {
          dependsOn: "windfarm",
          meetingCondition: (value) => value === Activity.WINDFARM,
        },
      ]
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
      [
        {
          dependsOn: "windfarm",
          meetingCondition: (value) => value === Activity.WINDFARM,
        },
      ]
    ),
    otherActivity: new FieldManager(otherActivity),
    otherActivityDescription: new FieldManager(
      otherActivityDescription,
      [Validators.required("Enter a description for your activity")],
      [
        {
          dependsOn: "otherActivity",
          meetingCondition: (value) => value === Activity.OTHER,
        },
      ]
    ),
    otherActivityLocation: new FieldManager(
      otherActivityLocation,
      [Validators.required("Enter where you use your beacon")],
      [
        {
          dependsOn: "otherActivity",
          meetingCondition: (value) => value === Activity.OTHER,
        },
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
        {
          dependsOn: "otherActivity",
          meetingCondition: (value) => value === Activity.OTHER,
        },
      ]
    ),
  });
};

const LandOther: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading =
    "Tell us about the type(s) of activity you'll use this beacon for";

  return (
    <Layout
      navigation={
        <BackButtonRouterIndexes href="/register-a-beacon/beacon-use" />
      }
      title={pageHeading}
      pageHasErrors={form.hasErrors}
      showCookieBanner={showCookieBanner}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <FormErrorSummary formErrors={form.errorSummary} />
            <GovUKBody>
              This information can be very helpful in a Search and Rescue
              situation.
            </GovUKBody>

            <Form>
              <LandOtherUses form={form} />

              <Button buttonText="Continue" />
            </Form>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const LandOtherUses: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps) => (
  <FormFieldset>
    <FormGroup>
      <FormLegend size="small">
        Tick all that apply and provide as much detail as you can
      </FormLegend>
      <CheckboxList conditional={true}>
        <CheckboxListItem
          id="driving"
          value={Activity.DRIVING}
          defaultChecked={form.fields.driving.value === Activity.DRIVING}
          label="Driving"
        />
        <CheckboxListItem
          id="cycling"
          value={Activity.CYCLING}
          defaultChecked={form.fields.cycling.value === Activity.CYCLING}
          label="Cycling"
        />
        <CheckboxListItem
          id="workingRemotely"
          value={Activity.WORKING_REMOTELY}
          defaultChecked={
            form.fields.workingRemotely.value === Activity.WORKING_REMOTELY
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
        </CheckboxListItem>
        <CheckboxListItem
          id="windfarm"
          value={Activity.WINDFARM}
          defaultChecked={form.fields.windfarm.value === Activity.WINDFARM}
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
        </CheckboxListItem>
        <CheckboxListItem
          id="otherActivity"
          value={Activity.OTHER}
          defaultChecked={form.fields.otherActivity.value === Activity.OTHER}
          label="Working on a windfarm"
          conditional={true}
        >
          <FormGroup
            errorMessages={form.fields.otherActivityDescription.errorMessages}
          >
            <Input
              id="otherActivityDescription"
              label="Please describe your use"
              defaultValue={form.fields.otherActivityDescription.value}
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
        </CheckboxListItem>
      </CheckboxList>
    </FormGroup>
  </FormFieldset>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/land-other-communication",
  definePageForm
);

export default LandOther;
