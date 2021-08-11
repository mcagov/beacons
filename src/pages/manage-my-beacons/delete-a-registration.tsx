import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { Button, LinkButton } from "../../components/Button";
import { FormFieldset, FormGroup, FormLegend } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { Beacon } from "../../entities/Beacon";
import { ReasonsForDeletingARegistration } from "../../entities/ReasonsForDeletingARegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { prettyUseName } from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { Rule } from "../../router/rules/Rule";

export interface DeleteRegistrationProps {
  previousPageURL: PageURLs;
  beacon: Beacon;
  showCookieBanner: boolean;
}

export const DeleteRegistration: FunctionComponent<DeleteRegistrationProps> = ({
  previousPageURL,
  beacon,
  showCookieBanner,
}: DeleteRegistrationProps): JSX.Element => {
  return (
    <BeaconsForm
      previousPageUrl={previousPageURL}
      pageHeading="Are you sure you want to delete this beacon registration from your account?"
      showCookieBanner={showCookieBanner}
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
        <FormGroup>
          <RadioList>
            <RadioListItem
              name="reason-for-deletion"
              id={ReasonsForDeletingARegistration.SOLD.toLowerCase()}
              value={ReasonsForDeletingARegistration.SOLD}
              label="I have sold this beacon"
            />
            <RadioListItem
              name="reason-for-deletion"
              id={ReasonsForDeletingARegistration.DESTROYED.toLowerCase()}
              value={ReasonsForDeletingARegistration.DESTROYED}
              label="This beacon has been destroyed"
            />
            <RadioListItem
              name="reason-for-deletion"
              id={ReasonsForDeletingARegistration.REPLACED.toLowerCase()}
              value={ReasonsForDeletingARegistration.REPLACED}
              label="This beacons has been replaced by another beacon"
            />
            <RadioListItem
              name="reason-for-deletion"
              id={ReasonsForDeletingARegistration.INCORRECTLY_REGISTERED.toLowerCase()}
              value={ReasonsForDeletingARegistration.INCORRECTLY_REGISTERED}
              label="This beacon was wrongly matched to my email address"
            />
            <RadioListItem
              name="reason-for-deletion"
              id={ReasonsForDeletingARegistration.OTHER.toLowerCase()}
              value={ReasonsForDeletingARegistration.OTHER}
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
      new WhenUserViewsDeleteRegistrationPage_ThenDisplayPage(context),
    ]).execute();
  })
);

class WhenUserViewsDeleteRegistrationPage_ThenDisplayPage implements Rule {
  private context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
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
        previousPageURL: PageURLs.accountHome,
        beacon: registrationToBeDeleted,
        showCookieBanner: true,
      },
    };
  }
}

export default DeleteRegistration;
