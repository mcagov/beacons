import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormLabelHeading,
} from "../../components/BeaconsForm";
import { TextareaCharacterCount } from "../../components/Textarea";
import { GovUKBody } from "../../components/Typography";
import { Environment } from "../../lib/deprecatedRegistration/types";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftBeaconUsePageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs, queryParams } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { makeDraftRegistrationMapper } from "../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotSpecifiedAUse } from "../../router/rules/IfUserHasNotSpecifiedAUse";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface MoreDetailsForm {
  moreDetails: string;
}

interface MoreDetailsPageProps extends DraftBeaconUsePageProps {
  environment: Environment;
  useIndex: number;
}

const MoreDetails: FunctionComponent<MoreDetailsPageProps> = ({
  form,
  showCookieBanner,
  environment,
  useIndex,
}: MoreDetailsPageProps): JSX.Element => {
  const previousPageUrlMap = {
    [Environment.MARITIME]:
      PageURLs.vesselCommunications + queryParams({ useIndex }),
    [Environment.AVIATION]:
      PageURLs.aircraftCommunications + queryParams({ useIndex }),
    [Environment.LAND]: PageURLs.landCommunications + queryParams({ useIndex }),
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
    >
      <BeaconsFormLabelHeading pageHeading={pageHeading} id="moreDetails" />
      {pageText}
      <MoreDetailsTextArea
        value={form.fields.moreDetails.value}
        errorMessages={form.fields.moreDetails.errorMessages}
        id="moreDetails"
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
    label="Please provide more details that could help in a search"
  />
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPage = PageURLs.additionalUse;

    return await new BeaconsPageRouter([
      new IfUserHasNotSpecifiedAUse(context),
      new IfUserHasNotStartedEditingADraftRegistration(context),
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
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<MoreDetailsPageProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  const useIndex = parseInt(context.query.useIndex as string);

  return {
    environment: draftRegistration?.uses[useIndex]?.environment as Environment,
    useIndex,
  };
};

const mapper = (
  context: BeaconsGetServerSidePropsContext
): DraftRegistrationFormMapper<MoreDetailsForm> => {
  const beaconUseMapper: BeaconUseFormMapper<MoreDetailsForm> = {
    formToDraftBeaconUse: (form) => ({
      moreDetails: form.moreDetails,
    }),
    beaconUseToForm: (draftBeaconUse) => ({
      moreDetails: draftBeaconUse.moreDetails,
    }),
  };

  const useIndex = parseInt(context.query.useIndex as string);

  return makeDraftRegistrationMapper<MoreDetailsForm>(
    useIndex,
    beaconUseMapper
  );
};

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
