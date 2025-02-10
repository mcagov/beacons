import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../../../../components/BeaconsForm";
import { FormGroup } from "../../../../../../components/Form";
import {
  RadioList,
  RadioListItem,
} from "../../../../../../components/RadioList";
import { DraftBeaconUse } from "../../../../../../entities/DraftBeaconUse";
import { DraftRegistration } from "../../../../../../entities/DraftRegistration";
import {
  Environment,
  Purpose,
} from "../../../../../../lib/deprecatedRegistration/types";
import { FieldManager } from "../../../../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../../../../lib/form/FormManager";
import { Validators } from "../../../../../../lib/form/Validators";
import { BeaconsGetServerSidePropsContext } from "../../../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../../../lib/middleware/withContainer";
import { withSession } from "../../../../../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../../../../../lib/types";
import { Actions } from "../../../../../../lib/URLs/Actions";
import { UrlBuilder } from "../../../../../../lib/URLs/UrlBuilder";
import { UsePages } from "../../../../../../lib/URLs/UsePages";
import { BeaconUseFormMapper } from "../../../../../../presenters/BeaconUseFormMapper";
import { FormSubmission } from "../../../../../../presenters/formSubmission";
import { makeDraftRegistrationMapper } from "../../../../../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../../../../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface PurposeForm {
  purpose: Purpose;
}

interface PurposeFormProps {
  form: FormJSON;
  showCookieBanner: boolean;
  environment: Environment;
  useId: string;
  draftRegistration: DraftRegistration;
}

const PurposePage: FunctionComponent<PurposeFormProps> = ({
  form,
  draftRegistration,
  showCookieBanner,
  environment,
  useId,
}: PurposeFormProps): JSX.Element => {
  const pageHeading = `Is your ${environment.toLowerCase()} use of this beacon mainly for pleasure or commercial reasons?`;
  const beaconUsePurposeFieldName = "purpose";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={UrlBuilder.buildUseUrl(
        Actions.update,
        UsePages.environment,
        draftRegistration.id,
        useId
      )}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
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
              hintText="Choose this if you mainly use the beacon for commercial activities"
            />
          </RadioList>
        </FormGroup>
      </BeaconsFormFieldsetAndLegend>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPage = UrlBuilder.buildUseUrl(
      Actions.update,
      UsePages.activity,
      context.query.registrationId as string,
      context.query.useId as string
    );
    ("");

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<PurposeForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<PurposeForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<PurposeForm>(
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
): Promise<Partial<PurposeFormProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  const useId = context.query.useId as string;

  return {
    environment: draftRegistration.uses[useId]?.environment as Environment,
    useId,
  };
};

const mapper = (context: BeaconsGetServerSidePropsContext) => {
  const beaconUseMapper: BeaconUseFormMapper<PurposeForm> = {
    formToDraftBeaconUse: (form: PurposeForm): DraftBeaconUse => ({
      purpose: form.purpose || "",
    }),
    beaconUseToForm: (draftBeaconUse: DraftBeaconUse): PurposeForm => ({
      purpose: draftBeaconUse.purpose as Purpose,
    }),
  };

  const useId = parseInt(context.query.useId as string);

  return makeDraftRegistrationMapper<PurposeForm>(useId, beaconUseMapper);
};

const validationRules = ({ purpose }: FormSubmission): FormManager => {
  return new FormManager({
    purpose: new FieldManager(
      purpose,
      [Validators.required("Beacon use purpose is a required field")],
      [],
      "pleasure"
    ),
  });
};

export default PurposePage;
