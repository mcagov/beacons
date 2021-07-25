import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { TextareaCharacterCount } from "../../components/Textarea";
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { Environment } from "../../lib/registration/types";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { makeRegistrationMapper } from "../../presenters/UseMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfNoUseIndex } from "../../router/rules/IfNoUseIndex";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface MoreDetailsForm {
  moreDetails: string;
}

interface MoreDetailsFormProps {
  form: FormJSON;
  showCookieBanner: boolean;
  environment: Environment;
}

const MoreDetails: FunctionComponent<MoreDetailsFormProps> = ({
  form,
  showCookieBanner,
  environment,
}: MoreDetailsFormProps): JSX.Element => {
  const previousPageUrlMap = {
    [Environment.MARITIME]: PageURLs.vesselCommunications,
    [Environment.AVIATION]: PageURLs.aircraftCommunications,
    [Environment.LAND]: PageURLs.landCommunications,
    "": PageURLs.environment,
  };

  const pageHeading = "Provide more details that could help in a search";
  const pageText = (
    <>
      <GovUKBody>
        Please provide a description of any vessel, aircraft, vehicle or
        anything else associated with this beacon.
      </GovUKBody>
      <GovUKBody>
        This might include defining features such as the length, colour etc) and
        any tracking details (e.g. RYA SafeTrx or Web) if you have them.
      </GovUKBody>
      <GovUKBody className="govuk-!-font-weight-bold">
        Please do not provide medical details as we cannot store these.
      </GovUKBody>
      <GovUKBody>
        This information is very helpful to Search and Rescue when trying to
        locate you
      </GovUKBody>
    </>
  );

  return (
    <BeaconsForm
      previousPageUrl={previousPageUrlMap[environment]}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
      pageText={pageText}
    >
      <MoreDetailsTextArea
        id="moreDetails"
        value={form.fields.moreDetails.value}
        errorMessages={form.fields.moreDetails.errorMessages}
      />
    </BeaconsForm>
  );
};

interface MoreDetailsTextAreaProps {
  id: string;
  value?: string;
  errorMessages: string[];
}

const MoreDetailsTextArea: FunctionComponent<MoreDetailsTextAreaProps> = ({
  id,
  value = "",
  errorMessages,
}: MoreDetailsTextAreaProps): JSX.Element => (
  <TextareaCharacterCount
    id={id}
    maxCharacters={250}
    rows={4}
    defaultValue={value}
    errorMessages={errorMessages}
  />
);

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      const nextPage = PageURLs.additionalUse;

      return await new BeaconsPageRouter([
        new IfNoUseIndex(context),
        new IfUserViewedRegistrationForm<MoreDetailsForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedInvalidRegistrationForm<MoreDetailsForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedValidRegistrationForm<MoreDetailsForm>(
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
): Promise<Partial<MoreDetailsFormProps>> =>
  (async () => {
    const draftRegistration = await context.container.getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    );

    const useIndex = parseInt(context.query.useIndex as string);

    return {
      environment: draftRegistration?.uses[useIndex]
        ?.environment as Environment,
    };
  })();

const mapper = (
  context: BeaconsGetServerSidePropsContext
): RegistrationFormMapper<MoreDetailsForm> =>
  (() => {
    const beaconUseMapper: BeaconUseFormMapper<MoreDetailsForm> = {
      toDraftBeaconUse: (form) => ({
        moreDetails: form.moreDetails,
      }),
      toForm: (draftBeaconUse) => ({
        moreDetails: draftBeaconUse.moreDetails,
      }),
    };

    const useIndex = parseInt(context.query.useIndex as string);

    return makeRegistrationMapper<MoreDetailsForm>(useIndex, beaconUseMapper);
  })();

const validationRules = ({ moreDetails }: FormSubmission): FormManager => {
  return new FormManager({
    moreDetails: new FieldManager(moreDetails, [
      Validators.required("More details is a required field"),
      Validators.maxLength(
        "More details must be less than 250 characters",
        250
      ),
    ]),
  });
};

export default MoreDetails;
