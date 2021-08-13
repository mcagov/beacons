import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../../components/BeaconsForm";
import { Button, LinkButton } from "../../../components/Button";
import { FormFieldset, FormGroup, FormLegend } from "../../../components/Form";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { SummaryList, SummaryListItem } from "../../../components/SummaryList";
import { Beacon } from "../../../entities/Beacon";
import { ReasonsForDeletingARegistration } from "../../../entities/ReasonsForDeletingARegistration";
import { showCookieBanner } from "../../../lib/cookies";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import {
  isInvalid,
  isValid,
  withErrorMessages,
  withoutErrorMessages,
} from "../../../lib/form/lib";
import { Validators } from "../../../lib/form/Validators";
import { FormManagerFactory } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../lib/redirectUserTo";
import { PageURLs } from "../../../lib/urls";
import { prettyUseName } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { Rule } from "../../../router/rules/Rule";

export interface DeleteRegistrationProps {
  form: FormJSON;
  beacon: Beacon;
  showCookieBanner: boolean;
  previousPageURL?: PageURLs;
}

interface DeleteRegistrationForm {
  reasonForDeletion: ReasonsForDeletingARegistration;
}

export const DeleteRegistration: FunctionComponent<DeleteRegistrationProps> = ({
  previousPageURL = PageURLs.accountHome,
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
          href={PageURLs.accountHome}
          classes="govuk-button--secondary govuk-!-margin-right-8"
        />
      }
    >
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
          <RadioList>
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
              label="This beacons has been replaced by another beacon"
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
              label="Other"
            />
          </RadioList>
        </FormGroup>
      </FormFieldset>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserViewsDeleteRegistrationPage_ThenDisplayPage(
        context,
        validationRules
      ),
      new GivenUserHasNotSelectedAReason_WhenUserTriesToDeleteARegistration_ThenShowErrorMessage(
        context,
        validationRules
      ),
      new GivenUserHasSelectedAReason_WhenUserTriesToDeleteARegistration_ThenDeleteTheRegistration(
        context,
        validationRules
      ),
    ]).execute();
  })
);

class WhenUserViewsDeleteRegistrationPage_ThenDisplayPage implements Rule {
  private context: BeaconsGetServerSidePropsContext;
  private validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  async action(): Promise<GetServerSidePropsResult<DeleteRegistrationProps>> {
    const { getBeaconsByAccountHolderId, getOrCreateAccountHolder } =
      this.context.container;

    const accountHolder = await getOrCreateAccountHolder(this.context.session);
    const registrationToBeDeleted = (
      await getBeaconsByAccountHolderId(accountHolder.id)
    ).find((beacon) => beacon.id == this.context.query.id);

    return {
      props: {
        form: withoutErrorMessages({}, this.validationRules),
        previousPageURL: PageURLs.accountHome,
        beacon: registrationToBeDeleted,
        showCookieBanner: true,
      },
    };
  }
}

class GivenUserHasNotSelectedAReason_WhenUserTriesToDeleteARegistration_ThenShowErrorMessage
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isInvalid(await this.form(), this.validationRules)
    );
  }

  async action(): Promise<GetServerSidePropsResult<DeleteRegistrationProps>> {
    const { getBeaconsByAccountHolderId, getOrCreateAccountHolder } =
      this.context.container;

    const accountHolder = await getOrCreateAccountHolder(this.context.session);
    const registrationToBeDeleted = (
      await getBeaconsByAccountHolderId(accountHolder.id)
    ).find((beacon) => beacon.id == this.context.query.id);

    return {
      props: {
        beacon: registrationToBeDeleted,
        form: await withErrorMessages(this.form(), this.validationRules),
        showCookieBanner: showCookieBanner(this.context),
      },
    };
  }

  private async form(): Promise<FormJSON> {
    return await this.context.container.parseFormDataAs<FormJSON>(
      this.context.req
    );
  }
}

class GivenUserHasSelectedAReason_WhenUserTriesToDeleteARegistration_ThenDeleteTheRegistration
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory
  ) {
    this.context = context;
    this.validationRules = validationRules;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isValid(await this.form(), this.validationRules)
    );
  }

  public async action(): Promise<
    GetServerSidePropsResult<DeleteRegistrationProps>
  > {
    const { deleteBeacon } = this.context.container;

    const success: boolean = (
      await deleteBeacon(
        await this.reasonForDeletion(),
        this.registrationId(),
        await this.accountHolderId()
      )
    ).success;

    if (success) return redirectUserTo(PageURLs.deleteRegistrationSuccess);
    else redirectUserTo(PageURLs.deleteRegistrationFailure);
  }

  private async form(): Promise<DeleteRegistrationForm> {
    return await this.context.container.parseFormDataAs<DeleteRegistrationForm>(
      this.context.req
    );
  }

  private registrationId(): string {
    return this.context.query.id as string;
  }

  private async accountHolderId(): Promise<string> {
    return (
      await this.context.container.getOrCreateAccountHolder(
        this.context.session
      )
    ).id;
  }

  private async reasonForDeletion(): Promise<ReasonsForDeletingARegistration> {
    return (await this.form()).reasonForDeletion;
  }
}

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
