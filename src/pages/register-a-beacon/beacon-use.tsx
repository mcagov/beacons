import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { FormFieldsetAndLegend } from "../../components/FormTypes";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
import { Environment } from "../../lib/deprecatedRegistration/types";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftBeaconUsePageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { ordinal } from "../../lib/writingStyle";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { makeDraftRegistrationMapper } from "../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotSpecifiedAUse } from "../../router/rules/IfUserHasNotSpecifiedAUse";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

interface BeaconUseForm {
  environment: Environment;
}

const BeaconUse: FunctionComponent<DraftBeaconUsePageProps> = ({
  form,
  showCookieBanner,
  useIndex,
}: DraftBeaconUsePageProps): JSX.Element => {
  const pageHeading = `What is the ${ordinal(
    useIndex + 1
  )} use for this beacon?`;
  const pageText = (
    <>
      {useIndex === 0 && (
        <GovUKBody>
          {
            "If you have multiple uses for this beacon, tell us about the main one first."
          }
        </GovUKBody>
      )}
      <GovUKBody>
        {"You will be able to tell us about other uses later in the form"}
      </GovUKBody>
    </>
  );

  const environmentFieldName = "environment";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={
        useIndex === 0
          ? PageURLs.beaconInformation
          : PageURLs.additionalUse + `?useIndex=${useIndex - 1}`
      }
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <FormFieldsetAndLegend pageHeading={pageHeading}>
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
            />

            <RadioListItem
              id="aviation"
              name={environmentFieldName}
              label="Aviation"
              hintText="This might include commercial or pleasure aircraft"
              value={Environment.AVIATION}
              defaultChecked={
                form.fields.environment.value === Environment.AVIATION
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
            />
          </RadioList>
        </FormGroup>
      </FormFieldsetAndLegend>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserHasNotSpecifiedAUse(context),
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new IfUserViewedRegistrationForm<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new IfUserSubmittedInvalidRegistrationForm<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new IfUserSubmittedValidRegistrationForm<BeaconUseForm>(
        context,
        validationRules,
        mapper(context),
        await nextPage(context)
      ),
    ]).execute();
  })
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Partial<DraftBeaconUsePageProps> => ({
  useIndex: parseInt(context.query.useIndex as string),
});

const nextPage = async (
  context: BeaconsGetServerSidePropsContext
): Promise<PageURLs> => {
  const { environment } =
    await context.container.parseFormDataAs<BeaconUseForm>(context.req);

  return environment === Environment.LAND
    ? PageURLs.activity
    : PageURLs.purpose;
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

  const useIndex = parseInt(context.query.useIndex as string);

  return makeDraftRegistrationMapper<BeaconUseForm>(useIndex, beaconUseMapper);
};

const validationRules = ({ environment }) => {
  return new FormManager({
    environment: new FieldManager(
      environment,
      [Validators.required("Where the beacon will be used is required")],
      [],
      "maritime"
    ),
  });
};

export default BeaconUse;
