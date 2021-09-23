import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../components/BeaconsForm";
import { FormGroup } from "../../../components/Form";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { WarningText } from "../../../components/WarningText";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import { withErrorMessages, withoutErrorMessages } from "../../../lib/form/lib";
import { Validators } from "../../../lib/form/Validators";
import { FormManagerFactory } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { AccountPageURLs } from "../../../lib/urls";
import { formatDateLong } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { Rule } from "../../../router/rules/Rule";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface ClaimLegacyBeaconPageProps {
  form: FormJSON;
  legacyBeacon: any;
  showCookieBanner: boolean;
}

const ClaimLegacyBeacon: FunctionComponent<ClaimLegacyBeaconPageProps> = ({
  form = withoutErrorMessages({}, validationRules),
  legacyBeacon,
  showCookieBanner,
}: ClaimLegacyBeaconPageProps) => {
  const legacyBeaconData = legacyBeacon.data.attributes.beacon;

  const fieldName = "claimResponse";

  const pageHeading = "Is this beacon yours?";
  const pageText = (
    <dl className="govuk-summary-list govuk-summary-list--no-border">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date first registered</dt>
        <dd className="govuk-summary-list__value">
          {formatDateLong(legacyBeaconData.firstRegistrationDate)}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Date last updated</dt>
        <dd className="govuk-summary-list__value">
          {formatDateLong(legacyBeaconData.lastModifiedDate)}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Hex ID/UIN</dt>
        <dd className="govuk-summary-list__value">{legacyBeaconData.hexId}</dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Beacon Manufacturer</dt>
        <dd className="govuk-summary-list__value">
          {legacyBeaconData.manufacturer}
        </dd>
      </div>
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">Beacon Model</dt>
        <dd className="govuk-summary-list__value">{legacyBeaconData.model}</dd>
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
            Please select one of the following options
          </div>
          <RadioList>
            <RadioListItem
              id="claim"
              name={fieldName}
              label="This is my beacon"
              hintText="By confirming this beacon is yours, you will be able to manage this beacon online. You will also need to provide additional information, which is vital to Search and Rescue should the beacon be activated."
              value="claim"
            />
            <RadioListItem
              id="reject"
              name={fieldName}
              label="This is not my beacon"
              hintText="We may have matched this beacon to you because it was previously registered to the same email address. This beacon will be removed from your account and you will no longer see it when you log in."
              value="reject"
            />
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
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
      new GivenUserHasNotSelectedAnOption_WhenUserSubmitsForm_ThenShowErrors(
        context,
        validationRules,
        props(context)
      ),
      //   // new WhenUserClaimsBeacon_ThenGoToUpdateFlowForClaimedBeacon(),
      //   // new WhenUserRejectsBeacon_ThenReturnToAccountHome(),
      //   // new WhenUserSelectsNoOptionsAndClicksContinue_ThenShowErrors(context, validationRules),
    ]).execute();
  })
);

const validationRules = ({ claimResponse }) => {
  return new FormManager({
    claimResponse: new FieldManager(
      claimResponse,
      [Validators.required("Select an option")],
      [],
      "claim"
    ),
  });
};

class GivenUserHasNotSelectedAnOption_WhenUserSubmitsForm_ThenShowErrors
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.additionalProps = additionalProps;
  }

  async condition(): Promise<boolean> {
    return this.context.req.method === "POST";
  }

  async action(): Promise<any> {
    return {
      props: {
        form: withErrorMessages(this.form, this.validationRules),
        ...(await this.additionalProps),
      },
    };
  }

  private async form(): Promise<any> {
    return await this.context.container.parseFormDataAs(this.context.req);
  }
}

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<any> => {
  const legacyBeaconId = context.query.id as string;
  const legacyBeacon =
    await context.container.legacyBeaconGateway.getLegacyBeacon(legacyBeaconId);
  return { legacyBeacon };
};

export default ClaimLegacyBeacon;
