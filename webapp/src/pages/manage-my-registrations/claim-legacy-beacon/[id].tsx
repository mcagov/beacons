import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../components/BeaconsForm";
import { FormGroup } from "../../../components/Form";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { WarningText } from "../../../components/WarningText";
import { LegacyBeacon } from "../../../entities/LegacyBeacon";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import { withoutErrorMessages } from "../../../lib/form/lib";
import { Validators } from "../../../lib/form/Validators";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { AccountPageURLs } from "../../../lib/urls";
import { formatDateLong } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { GivenUserSelectsClaim_WhenUserSubmitsForm_ThenPromptUserToUpdateTheirClaimedBeacon } from "../../../router/rules/GivenUserSelectsClaim_WhenUserSubmitsForm_ThenPromptUserToUpdateTheirClaimedBeacon";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../router/rules/WhenUserSubmitsInvalidForm_ThenShowErrors";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface ClaimLegacyBeaconPageProps {
  form: FormJSON;
  legacyBeacon: LegacyBeacon;
  showCookieBanner: boolean;
}

const ClaimLegacyBeacon: FunctionComponent<ClaimLegacyBeaconPageProps> = ({
  form = withoutErrorMessages({}, validationRules),
  legacyBeacon,
  showCookieBanner,
}: ClaimLegacyBeaconPageProps) => {
  const fieldName = "claimResponse";

  const pageHeading = "Is this beacon yours?";
  const pageText = (
    <dl className="govuk-summary-list govuk-summary-list--no-border">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date first registered</dt>
        <dd className="govuk-summary-list__value">
          {formatDateLong(legacyBeacon.dateFirstRegistered)}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date last updated</dt>
        <dd className="govuk-summary-list__value">
          {formatDateLong(legacyBeacon.dateLastUpdated)}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Hex ID/UIN</dt>
        <dd className="govuk-summary-list__value">{legacyBeacon.hexId}</dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Beacon Manufacturer</dt>
        <dd className="govuk-summary-list__value">
          {legacyBeacon.manufacturer}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Beacon Model</dt>
        <dd className="govuk-summary-list__value">{legacyBeacon.model}</dd>
      </div>
    </dl>
  );

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={AccountPageURLs.accountHome}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        {pageText}
        <FormGroup errorMessages={form.fields.claimResponse.errorMessages}>
          <div id="sign-in-hint" className="govuk-hint">
            Please confirm that this is your beacon.
          </div>
          <RadioList>
            <RadioListItem
              id="claim"
              name={fieldName}
              label="This is my beacon"
              hintText="By confirming this beacon is yours, you will be able to manage this beacon online. You will also need to provide additional information, which is vital to Search and Rescue should the beacon be activated."
              value="claim"
            />
            {/*<RadioListItem*/}
            {/*  id="reject"*/}
            {/*  name={fieldName}*/}
            {/*  label="This is not my beacon"*/}
            {/*  hintText="We may have matched this beacon to you because it was previously registered to the same email address. This beacon will be removed from your account and you will no longer see it when you log in."*/}
            {/*  value="reject"*/}
            {/*/>*/}
          </RadioList>
        </FormGroup>
        <h2 className="govuk-heading-m">
          Telling us if this beacon is yours is best for Search and Rescue. But
          you can still use your beacon even if you don&apos;t tell us it&apos;s
          yours.
        </h2>
        <WarningText>
          Your old beacon information is still available to Search and Rescue,
          even if you choose not to manage it online. If you activate your
          beacon, Search and Rescue will still be able to identify and locate
          you.
          <br />
          <br />
          However, by telling us the beacon is yours and choosing to manage the
          beacon online, Search and Rescue will be provided with the most up to
          date information about yourself and beacon use - vital in an
          emergency.
        </WarningText>
      </BeaconsFormFieldsetAndLegend>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const legacyBeaconId = context.query.id as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
      new WhenUserSubmitsInvalidForm_ThenShowErrors(
        context,
        validationRules,
        props(context)
      ),
      new GivenUserSelectsClaim_WhenUserSubmitsForm_ThenPromptUserToUpdateTheirClaimedBeacon(
        context,
        legacyBeaconId
      ),
      // new WhenUserRejectsBeacon_ThenReturnToAccountHome(),
    ]).execute();
  })
);

const validationRules = ({ claimResponse }) => {
  return new FormManager({
    claimResponse: new FieldManager(
      claimResponse,
      [Validators.required("Select an option")],
      [],
      "claimResponse"
    ),
  });
};

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<any> => {
  const legacyBeaconId = context.query.id as string;
  return {
    legacyBeacon: await context.container.legacyBeaconGateway.getById(
      legacyBeaconId
    ),
  };
};

export default ClaimLegacyBeacon;
