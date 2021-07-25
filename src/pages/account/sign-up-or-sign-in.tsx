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
import { PageURLs } from "../../lib/urls";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserSubmittedInvalidSimpleForm } from "../../router/rules/IfUserSubmittedInvalidSimpleForm";
import { IfUserSubmittedValidSimpleForm } from "../../router/rules/IfUserSubmittedValidSimpleForm";
import { IfUserViewedSimpleForm } from "../../router/rules/IfUserViewedSimpleForm";

interface SignUpOrSignInForm {
  signUpOrSignIn: string;
}

export const SignUpOrSignIn: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Do you have a Beacon Registry Account?";
  const pageText = (
    <GovUKBody>
      {"You will need an account to register your beacon online."}
    </GovUKBody>
  );

  const fieldName = "signUpOrSignIn";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={PageURLs.start}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      pageText={pageText}
      includeUseIndex={false}
    >
      <FormGroup errorMessages={form.fields.signUpOrSignIn.errorMessages}>
        <RadioList>
          <RadioListItem
            id="signIn"
            name={fieldName}
            label="Sign in using my Beacon Registry Account"
            hintText="You’ll have an account if you’ve registered a beacon before. Your log in details will be an email address and password"
            value="signIn"
            defaultChecked={form.fields.signUpOrSignIn.value === "signIn"}
          />
          <RadioListItem
            id="signUp"
            name={fieldName}
            label="Create a Beacon Registry Account"
            hintText="You must create and account before you can register your first beacon"
            value="signUp"
            defaultChecked={form.fields.signUpOrSignIn.value === "signUp"}
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
        new IfUserViewedSimpleForm(context, validationRules),
        new IfUserSubmittedInvalidSimpleForm(context, validationRules),
        new IfUserSubmittedValidSimpleForm(
          context,
          validationRules,
          nextPageUrl(context)
        ),
      ]).execute();
    })
  )
);

const nextPageUrl = (context: BeaconsGetServerSidePropsContext) =>
  (async () => {
    const form = await context.container.parseFormDataAs<SignUpOrSignInForm>(
      context.req
    );

    switch (form.signUpOrSignIn) {
      case "signUp":
        return PageURLs.signUp;
      case "signIn":
        return PageURLs.signIn;
    }
  })();

const validationRules = ({ signUpOrSignIn }) => {
  return new FormManager({
    signUpOrSignIn: new FieldManager(signUpOrSignIn, [
      Validators.required("Please select an option"),
    ]),
  });
};

export default SignUpOrSignIn;
