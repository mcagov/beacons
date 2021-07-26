import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { Environment, Purpose } from "../../lib/registration/types";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { makeRegistrationMapper } from "../../presenters/UseMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfNoUseIndex } from "../../router/rules/IfNoUseIndex";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface PurposeForm {
  purpose: Purpose;
}

interface PurposeFormProps {
  form: FormJSON;
  showCookieBanner: boolean;
  environment: Environment;
}

const PurposePage: FunctionComponent<PurposeFormProps> = ({
  form,
  showCookieBanner,
  environment,
}: PurposeFormProps): JSX.Element => {
  const pageHeading = `Is your ${environment.toLowerCase()} use of this beacon mainly for pleasure or commercial reasons?`;
  const beaconUsePurposeFieldName = "purpose";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl="/register-a-beacon/beacon-use"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <FormGroup errorMessages={form.fields.purpose.errorMessages}>
        <RadioList>
          <RadioListItem
            id="pleasure"
            name={beaconUsePurposeFieldName}
            value={Purpose.PLEASURE}
            label="Personal pleasure"
            defaultChecked={form.fields.purpose.value === Purpose.PLEASURE}
            hintText="Choose this if you mainly use the beacon for leisure, or personal trips. If you hire out pleasure craft choose 'commercial-use' instead"
          />
          <RadioListItem
            id="commercial"
            name={beaconUsePurposeFieldName}
            value={Purpose.COMMERCIAL}
            defaultChecked={form.fields.purpose.value === Purpose.COMMERCIAL}
            label="Commercial use"
            hintText="Choose this if you mainly use the beacon for commercial activities such as Fishing, Merchant vessels, Hire of pleasure craft, Delivery Skipper etc"
          />
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      const nextPage = PageURLs.activity;

      return await new BeaconsPageRouter([
        new IfNoUseIndex(context),
        new IfUserViewedRegistrationForm<PurposeForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedInvalidRegistrationForm<PurposeForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedValidRegistrationForm<PurposeForm>(
          context,
          validationRules,
          mapper(context),
          nextPage
        ),
      ]).execute();
    })
  )
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<PurposeFormProps>> =>
  (async () => {
    const draftRegistration = await context.container.getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    );

    const useIndex = parseInt(context.query.useIndex as string);

    return {
      environment: draftRegistration.uses[useIndex].environment as Environment,
    };
  })();

const mapper = (context: BeaconsGetServerSidePropsContext) =>
  (() => {
    const beaconUseMapper: BeaconUseFormMapper<PurposeForm> = {
      toDraftBeaconUse: (form: PurposeForm): DraftBeaconUse => ({
        purpose: form.purpose,
      }),
      toForm: (draftBeaconUse: DraftBeaconUse): PurposeForm => ({
        purpose: draftBeaconUse.purpose as Purpose,
      }),
    };

    const useIndex = parseInt(context.query.useIndex as string);

    return makeRegistrationMapper<PurposeForm>(useIndex, beaconUseMapper);
  })();

const validationRules = ({ purpose }: FormSubmission): FormManager => {
  return new FormManager({
    purpose: new FieldManager(purpose, [
      Validators.required("Beacon use purpose is a required field"),
    ]),
  });
};

export default PurposePage;
