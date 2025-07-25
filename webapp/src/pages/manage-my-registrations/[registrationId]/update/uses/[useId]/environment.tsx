import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../../../../components/BeaconsForm";
import { FormGroup } from "../../../../../../components/Form";
import {
  RadioList,
  RadioListItem,
} from "../../../../../../components/RadioList";
import { GovUKBody } from "../../../../../../components/Typography";
import { Environment } from "../../../../../../lib/deprecatedRegistration/types";
import { FieldManager } from "../../../../../../lib/form/FieldManager";
import { FormManager } from "../../../../../../lib/form/FormManager";
import { Validators } from "../../../../../../lib/form/Validators";
import { DraftBeaconUsePageProps } from "../../../../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../../../lib/middleware/withContainer";
import { withSession } from "../../../../../../lib/middleware/withSession";
import { Actions } from "../../../../../../lib/URLs/Actions";
import { UrlBuilder } from "../../../../../../lib/URLs/UrlBuilder";
import { UsePages } from "../../../../../../lib/URLs/UsePages";
import { ordinal } from "../../../../../../lib/writingStyle";
import { BeaconUseFormMapper } from "../../../../../../presenters/BeaconUseFormMapper";
import { makeDraftRegistrationMapper } from "../../../../../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../../../../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface BeaconUseForm {
  environment: Environment;
}

const UpdateBeaconUsePage: FunctionComponent<DraftBeaconUsePageProps> = ({
  form,
  draftRegistration,
  showCookieBanner,
  useId,
}: DraftBeaconUsePageProps): JSX.Element => {
  const pageHeading = `What is the ${ordinal(
    parseInt(useId) + 1,
  )} use for this beacon?`;
  const pageText = (
    <>
      {parseInt(useId) === 0 && (
        <GovUKBody>
          {
            "If you have multiple uses for this beacon, tell us about the main one first."
          }
        </GovUKBody>
      )}
      <GovUKBody>
        {"You will be able to tell us about other uses later in the form."}
      </GovUKBody>
    </>
  );

  const environmentFieldName = "environment";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={UrlBuilder.buildUseSummaryUrl(
        Actions.update,
        draftRegistration.id,
      )}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        {pageText}
        <FormGroup errorMessages={form.fields.environment.errorMessages}>
          <RadioList conditional={true}>
            <RadioListItem
              id="maritime"
              name={environmentFieldName}
              label="Maritime"
              hintText="This might include commercial or pleasure sailing / motor vessels or unpowered craft. It could also include sea-based windfarms and rigs/platforms."
              value={Environment.MARITIME}
              defaultChecked={
                form.fields.environment.value === Environment.MARITIME
              }
              disabled={
                form.fields.environment.value &&
                form.fields.environment.value !== Environment.MARITIME
              }
            />

            <RadioListItem
              id="aviation"
              name={environmentFieldName}
              label="Aviation"
              hintText="This might include commercial or pleasure aircraft."
              value={Environment.AVIATION}
              defaultChecked={
                form.fields.environment.value === Environment.AVIATION
              }
              disabled={
                form.fields.environment.value &&
                form.fields.environment.value !== Environment.AVIATION
              }
            />

            <RadioListItem
              id="land"
              name={environmentFieldName}
              label="Land-based"
              hintText="This could include vehicle or other overland uses. It could also include land-based windfarms."
              value={Environment.LAND}
              defaultChecked={
                form.fields.environment.value === Environment.LAND
              }
              disabled={
                form.fields.environment.value &&
                form.fields.environment.value !== Environment.LAND
              }
            />
          </RadioList>
        </FormGroup>
      </BeaconsFormFieldsetAndLegend>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        props(context),
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        props(context),
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        await nextPage(context),
      ),
    ]).execute();
  }),
);

const props = (
  context: BeaconsGetServerSidePropsContext,
): Partial<DraftBeaconUsePageProps> => ({
  useId: context.query.useId as string,
});

const nextPage = async (
  context: BeaconsGetServerSidePropsContext,
): Promise<string> => {
  const { environment } =
    await context.container.parseFormDataAs<BeaconUseForm>(context.req);

  const registrationId = context.query.registrationId as string;
  const useId = context.query.useId as string;

  const nextPageInFlow =
    environment === Environment.LAND ? UsePages.activity : UsePages.purpose;

  return UrlBuilder.buildUseUrl(
    Actions.update,
    nextPageInFlow,
    registrationId,
    useId,
  );
};

const mapper = (context: BeaconsGetServerSidePropsContext) => {
  const beaconUseMapper: BeaconUseFormMapper<BeaconUseForm> = {
    formToDraftBeaconUse: (form) => {
      return {
        environment: form.environment,
      };
    },
    beaconUseToForm: (draftBeaconUse) => {
      return {
        environment: draftBeaconUse.environment as Environment,
      };
    },
  };

  const useId = parseInt(context.query.useId as string);

  return makeDraftRegistrationMapper<BeaconUseForm>(useId, beaconUseMapper);
};

const validationRules = ({ environment }) => {
  return new FormManager({
    environment: new FieldManager(
      environment,
      [Validators.required("Where the beacon will be used is required")],
      [],
      "maritime",
    ),
  });
};

export default UpdateBeaconUsePage;
