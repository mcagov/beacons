import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { AnchorLink, GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import {
  isValid,
  withErrorMessages,
  withoutErrorMessages,
} from "../../lib/form/lib";
import { Validators } from "../../lib/form/Validators";
import {
  DraftRegistrationPageProps,
  FormManagerFactory,
} from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { acceptRejectCookieId } from "../../lib/types";
import { AccountPageURLs, GeneralPageURLs } from "../../lib/urls";
import { FormSubmission } from "../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { Rule } from "../../router/rules/Rule";
import { WhenUserViewsPage_ThenDisplayPage } from "../../router/rules/WhenUserViewsPage_ThenDisplayPage";

export const SignUpOrSignIn: FunctionComponent<DraftRegistrationPageProps> = ({
  form = withoutErrorMessages({}, validationRules),
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Beacon Registry account sign-in";
  const pageText = (
    <GovUKBody>
      This is a customer self-service system and by signing up you automatically
      accept the{" "}
      <AnchorLink href="https://www.gov.uk/mca/privacy-policy#mhz-beacons-privacy-information-notice">
        service privacy policy
      </AnchorLink>
    </GovUKBody>
  );

  const fieldName = "signUpOrSignIn";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={GeneralPageURLs.start}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      includeUseId={false}
    >
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        {pageText}
        <FormGroup errorMessages={form.fields.signUpOrSignIn.errorMessages}>
          <RadioList>
            <RadioListItem
              id="signUp"
              name={fieldName}
              label="Create a Beacon Registry Account"
              hintText="You must create an account before you can claim any existing records or add any new beacons"
              value="signUp"
              defaultChecked={form.fields.signUpOrSignIn.value === "signUp"}
            />
            <RadioListItem
              id="signIn"
              name={fieldName}
              label="Sign-in to your account"
              hintText=""
              value="signIn"
              defaultChecked={form.fields.signUpOrSignIn.value === "signIn"}
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
      new WhenUserViewsPage_ThenDisplayPage(context),
      new IfUserSubmittedSignUpOrSignInForm(context, validationRules),
    ]).execute();
  })
);

const validationRules = ({ signUpOrSignIn }) => {
  return new FormManager({
    signUpOrSignIn: new FieldManager(
      signUpOrSignIn,
      [
        Validators.required(
          "Select an option to sign in or to create an account"
        ),
      ],
      [],
      "signUp"
    ),
  });
};

class IfUserSubmittedSignUpOrSignInForm implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;

  constructor(context, validationRules) {
    this.context = context;
    this.validationRules = validationRules;
  }

  async condition(): Promise<boolean> {
    return this.context.req.method === "POST";
  }

  async action(): Promise<GetServerSidePropsResult<any>> {
    if (await this.formIsValid()) return redirectUserTo(await this.nextPage());

    return this.showFormWithErrorMessages();
  }

  private async form(): Promise<FormSubmission> {
    return await this.context.container.parseFormDataAs(this.context.req);
  }

  private async formIsValid(): Promise<boolean> {
    return isValid(await this.form(), this.validationRules);
  }

  private async nextPage(): Promise<AccountPageURLs> {
    switch ((await this.form()).signUpOrSignIn) {
      case "signUp":
        return AccountPageURLs.signUp;
      case "signIn":
        return AccountPageURLs.signIn;
    }
  }

  private showFormWithErrorMessages(): GetServerSidePropsResult<any> {
    return {
      props: {
        form: withErrorMessages(this.form, this.validationRules),
        showCookieBanner: this.userHasNotHiddenEssentialCookieBanner(),
      },
    };
  }

  private userHasNotHiddenEssentialCookieBanner(): boolean {
    return !this.context.req.cookies[acceptRejectCookieId];
  }
}

export default SignUpOrSignIn;
