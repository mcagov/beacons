import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsFormFieldsetAndLegend } from "../../../components/BeaconsForm";
import { BackButton, Button } from "../../../components/Button";
import { Form, FormGroup } from "../../../components/Form";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { BeaconRegistryContactInfo } from "../../../components/Mca";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { GovUKBody, SectionHeading } from "../../../components/Typography";
import { WarningText } from "../../../components/WarningText";
import { withErrorMessages } from "../../../lib/form/lib";
import { FormManagerFactory } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { AccountPageURLs } from "../../../lib/urls";
import { formatDateLong } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { Rule } from "../../../router/rules/Rule";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface ClaimLegacyBeaconPageProps {
  legacyBeacon: any;
  showCookieBanner: boolean;
}

const ClaimLegacyBeacon: FunctionComponent<ClaimLegacyBeaconPageProps> = ({
  legacyBeacon,
  showCookieBanner,
}: ClaimLegacyBeaconPageProps) => {
  const legacyBeaconData = legacyBeacon.data.attributes.beacon;

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
    <>
      <Layout
        navigation={<BackButton href={AccountPageURLs.accountHome} />}
        title={pageHeading}
      >
        <Grid
          mainContent={
            <Form>
              <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
                {pageText}
                <FormGroup>
                  <div id="sign-in-hint" className="govuk-hint">
                    Please select one of the following options
                  </div>
                  <RadioList>
                    <RadioListItem
                      id="thisIsMyBeacon"
                      name="thisIsMyBeacon"
                      label="This is my beacon"
                      hintText="By confirming this beacon is yours, you will be able to manage this beacon online. You will also need to provide additional information, which is vital to Search and Rescue should the beacon be activated."
                      value="thisIsMyBeacon"
                    />
                    <RadioListItem
                      id="thisIsNotMyBeacon"
                      name="thisIsNotMyBeacon"
                      label="This is not my beacon"
                      hintText="We may have matched this beacon to you because it was previously registered to the same email address. This beacon will be removed from your account and you will no longer see it when you log in."
                      value="thisIsNotMyBeacon"
                    />
                  </RadioList>
                </FormGroup>
                <Button buttonText="Continue" />
              </BeaconsFormFieldsetAndLegend>
            </Form>
          }
        />
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
        <SectionHeading>Contact the Beacon Registry Team</SectionHeading>
        <GovUKBody>
          If you have a question about your beacon registration, contact the UK
          Beacon Registry team on:
        </GovUKBody>
        <BeaconRegistryContactInfo />
      </Layout>
    </>
  );
};

// To get this test to pass:
// 1. Use WhenUserViewPage_ThenDisplayPage() rule with a props function that gets the legacy beacon

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      //   new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
      //   // new WhenUserClaimsBeacon_ThenGoToUpdateFlowForClaimedBeacon(),
      //   // new WhenUserRejectsBeacon_ThenReturnToAccountHome(),
      //   // new WhenUserSelectsNoOptionsAndClicksContinue_ThenShowErrors(context, validationRules),
    ]).execute();
  })
);

class WhenUserSelectsNoOptionsAndClicksContinue_ThenShowErrors implements Rule {
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
    // is a POST request and fails validation rules
    return this.userSubmittedForm();
  }

  private userSubmittedForm(): boolean {
    return this.context.req.method === "POST";
  }

  async action(): Promise<any> {
    return {
      props: {
        form: withErrorMessages(this.form, this.validationRules),
        showCookieBanner: this.userHasNotHiddenEssentialCookieBanner(),
      },
    };
  }

  private async form(): Promise<T> {
    return await this.context.container.parseFormDataAs<T>(this.context.req);
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
