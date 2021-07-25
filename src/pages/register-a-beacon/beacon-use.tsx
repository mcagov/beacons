import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormPageProps } from "../../lib/handlePageRequest";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { Environment } from "../../lib/registration/types";
import { PageURLs } from "../../lib/urls";
import { ordinal } from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfNoUseIndexRule } from "../../router/rules/IfNoUseIndexRule";
import { IfUserSubmittedInvalidRegistrationFormRule } from "../../router/rules/IfUserSubmittedInvalidRegistrationFormRule";
import { IfUserSubmittedValidRegistrationFormRule } from "../../router/rules/IfUserSubmittedValidRegistrationFormRule";
import { IfUserViewedRegistrationFormRule } from "../../router/rules/IfUserViewedRegistrationFormRule";

interface BeaconUseForm {
  environment: Environment;
}

const BeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
  useIndex,
}: FormPageProps): JSX.Element => {
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
      pageText={pageText}
    >
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
            defaultChecked={form.fields.environment.value === Environment.LAND}
          />
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      return await new BeaconsPageRouter([
        new IfNoUseIndexRule(context),
        new IfUserViewedRegistrationFormRule<BeaconUseForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedInvalidRegistrationFormRule<BeaconUseForm>(
          context,
          validationRules,
          mapper(context),
          props(context)
        ),
        new IfUserSubmittedValidRegistrationFormRule<BeaconUseForm>(
          context,
          validationRules,
          mapper(context),
          nextPage(context)
        ),
      ]).execute();
    })
  )
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Partial<FormPageProps> =>
  (() => ({
    useIndex: parseInt(context.query.useIndex as string),
  }))();

const nextPage = (
  context: BeaconsGetServerSidePropsContext
): Promise<PageURLs> =>
  (async () => {
    const { environment } =
      await context.container.parseFormDataAs<BeaconUseForm>(context.req);

    return environment === Environment.LAND
      ? PageURLs.activity
      : PageURLs.purpose;
  })();

const mapper = (context: BeaconsGetServerSidePropsContext) =>
  (() => {
    const useIndex = parseInt(context.query.useIndex as string);

    return {
      toDraftRegistration: (form) => {
        return {
          uses: new Array(useIndex > 1 ? useIndex - 1 : 1).fill({}).fill(
            {
              environment: form.environment,
            },
            useIndex,
            useIndex + 1
          ),
        };
      },
      toForm: (draftRegistration) => {
        return {
          environment: draftRegistration?.uses
            ? (draftRegistration?.uses[useIndex]?.environment as Environment)
            : null,
        };
      },
    };
  })();

const validationRules = ({ environment }) => {
  return new FormManager({
    environment: new FieldManager(environment, [
      Validators.required("Where the beacon will be used is required"),
    ]),
  });
};

export default BeaconUse;
