import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormHeading,
} from "../../../components/BeaconsForm";
import { Button, LinkButton } from "../../../components/Button";
import { FormFieldset, FormGroup, FormLegend } from "../../../components/Form";
import { Input } from "../../../components/Input";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { SummaryList, SummaryListItem } from "../../../components/SummaryList";
import { Beacon } from "../../../entities/Beacon";
import { ReasonsForDeletingARegistration } from "../../../entities/ReasonsForDeletingARegistration";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import { Validators } from "../../../lib/form/Validators";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { CreateRegistrationPageURLs } from "../../../lib/urls";
import { prettyUseName } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { GivenUserIsDeletingARegistration_WhenUserDoesNotProvideAReason_ThenShowErrorMessage } from "../../../router/rules/GivenUserIsDeletingARegistration_WhenUserDoesNotProvideAReason_ThenShowErrorMessage";
import { GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration } from "../../../router/rules/GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration";
import { GivenUserIsDeletingARegistration_WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/GivenUserIsDeletingARegistration_WhenUserViewsPage_ThenDisplayPage";
import { IfUserDoesNotHaveValidSession } from "../../../router/rules/IfUserDoesNotHaveValidSession";

export interface DeleteRegistrationProps {
  form: FormJSON;
  beacon: Beacon;
  showCookieBanner: boolean;
  previousPageURL?: CreateRegistrationPageURLs;
}

export interface DeleteRegistrationForm {
  reasonForDeletion: ReasonsForDeletingARegistration;
  anotherReasonText: string;
}

export const DeleteRegistration: FunctionComponent<DeleteRegistrationProps> = ({
  previousPageURL = AccountPageURLs.accountHome,
  beacon,
  showCookieBanner,
  form,
}: DeleteRegistrationProps): JSX.Element => {
  return (
    <BeaconsForm
      previousPageUrl={previousPageURL}
      pageHeading="Are you sure you want to delete this beacon registration from your account?"
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      continueButton={
        <Button
          buttonText="Delete this registration"
          classes="govuk-button--warning govuk-!-margin-right-8"
        />
      }
      cancelButton={
        <LinkButton
          buttonText="Cancel"
          href={AccountPageURLs.accountHome}
          classes="govuk-button--secondary govuk-!-margin-right-8"
        />
      }
    >
      <BeaconsFormHeading pageHeading="Are you sure you want to delete this beacon registration from your account?" />
      <SummaryList>
        <SummaryListItem labelText="Beacon information">
          {beacon.manufacturer} <br />
          {beacon.model} <br />
          Hex ID/UIN: {beacon.hexId}
        </SummaryListItem>
        <SummaryListItem labelText="Used for">
          {beacon.uses.map((use) => (
            <>
              {prettyUseName({
                environment: use.environment,
                purpose: use.purpose,
                activity: use.activity,
              })}
              <br />
            </>
          ))}
        </SummaryListItem>
      </SummaryList>
      <FormFieldset>
        <FormLegend size="medium">Tell us why</FormLegend>
        <FormGroup errorMessages={form.fields.reasonForDeletion.errorMessages}>
          <RadioList conditional={true}>
            <RadioListItem
              name="reasonForDeletion"
              id={ReasonsForDeletingARegistration.SOLD.toLowerCase()}
              value={ReasonsForDeletingARegistration.SOLD}
              defaultChecked={
                form.fields.reasonForDeletion.value ===
                ReasonsForDeletingARegistration.SOLD
              }
              label="I have sold this beacon"
            />
            <RadioListItem
              name="reasonForDeletion"
              id={ReasonsForDeletingARegistration.DESTROYED.toLowerCase()}
              value={ReasonsForDeletingARegistration.DESTROYED}
              defaultChecked={
                form.fields.reasonForDeletion.value ===
                ReasonsForDeletingARegistration.DESTROYED
              }
              label="This beacon has been destroyed"
            />
            <RadioListItem
              name="reasonForDeletion"
              id={ReasonsForDeletingARegistration.REPLACED.toLowerCase()}
              value={ReasonsForDeletingARegistration.REPLACED}
              defaultChecked={
                form.fields.reasonForDeletion.value ===
                ReasonsForDeletingARegistration.REPLACED
              }
              label="This beacon has been replaced by another beacon"
            />
            <RadioListItem
              name="reasonForDeletion"
              id={ReasonsForDeletingARegistration.INCORRECTLY_REGISTERED.toLowerCase()}
              value={ReasonsForDeletingARegistration.INCORRECTLY_REGISTERED}
              defaultChecked={
                form.fields.reasonForDeletion.value ===
                ReasonsForDeletingARegistration.INCORRECTLY_REGISTERED
              }
              label="This beacon was wrongly matched to my email address"
            />
            <RadioListItem
              name="reasonForDeletion"
              id={ReasonsForDeletingARegistration.OTHER.toLowerCase()}
              value={ReasonsForDeletingARegistration.OTHER}
              defaultChecked={
                form.fields.reasonForDeletion.value ===
                ReasonsForDeletingARegistration.OTHER
              }
              label="Another reason"
              conditional={true}
            >
              <FormGroup
                errorMessages={form.fields.reasonForDeletion.errorMessages}
              >
                <Input
                  id="anotherReasonText"
                  label="Tell us why you are deleting this beacon registration"
                  defaultValue={form.fields.reasonForDeletion.value}
                />
              </FormGroup>
            </RadioListItem>
          </RadioList>
        </FormGroup>
      </FormFieldset>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
      new GivenUserIsDeletingARegistration_WhenUserViewsPage_ThenDisplayPage(
        context,
        validationRules
      ),
      new GivenUserIsDeletingARegistration_WhenUserDoesNotProvideAReason_ThenShowErrorMessage(
        context,
        validationRules
      ),
      new GivenUserIsDeletingARegistration_WhenUserProvidesAReason_ThenDeleteTheRegistration(
        context,
        validationRules
      ),
    ]).execute();
  })
);

const validationRules = ({
  reasonForDeletion,
}: DeleteRegistrationForm): FormManager => {
  return new FormManager({
    reasonForDeletion: new FieldManager(reasonForDeletion, [
      Validators.required("Enter a reason for deleting your registration"),
    ]),
  });
};

export default DeleteRegistration;
