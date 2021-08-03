import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
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
import { PageURLs } from "../../lib/urls";
import { FormSubmission } from "../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserViewedPage } from "../../router/rules/IfUserViewedPage";
import { Rule } from "../../router/rules/Rule";

export const SignUpOrSignIn: FunctionComponent<DraftRegistrationPageProps> = ({
  form = withoutErrorMessages({}, validationRules),
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
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

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserViewedPage(context),
      new IfUserSubmittedSignUpOrSignInForm(context, validationRules),
    ]).execute();
  })
);

const validationRules = ({ signUpOrSignIn }) => {
  return new FormManager({
    signUpOrSignIn: new FieldManager(signUpOrSignIn, [
      Validators.required("Please select an option"),
    ]),
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

  private async nextPage(): Promise<PageURLs> {
    switch ((await this.form()).signUpOrSignIn) {
      case "signUp":
        return PageURLs.signUp;
      case "signIn":
        return PageURLs.signIn;
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
