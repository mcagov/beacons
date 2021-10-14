import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
} from "../../../components/BeaconsForm";
import { FormGroup } from "../../../components/Form";
import { RadioList, RadioListItem } from "../../../components/RadioList";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormManager } from "../../../lib/form/FormManager";
import {
  isValid,
  withErrorMessages,
  withoutErrorMessages,
} from "../../../lib/form/lib";
import { Validators } from "../../../lib/form/Validators";
import {
  DraftRegistrationPageProps,
  FormManagerFactory,
} from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../lib/redirectUserTo";
import { acceptRejectCookieId } from "../../../lib/types";
import { AccountPageURLs } from "../../../lib/urls";
import { FormSubmission } from "../../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { Rule } from "../../../router/rules/Rule";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";

export const UpdateAccountLocationChoiceForm: FunctionComponent<DraftRegistrationPageProps> =
  ({
    form = withoutErrorMessages({}, validationRules),
    showCookieBanner,
  }: DraftRegistrationPageProps): JSX.Element => {
    const pageHeading = "Do you live in the United Kingdom?";

    const fieldName = "accountHolderLocation";

    return (
      <BeaconsForm
        formErrors={form.errorSummary}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        includeUseId={false}
        cancelLink={
          <a
            className="govuk-link govuk-link--no-visited-state"
            href={AccountPageURLs.accountHome}
          >
            Cancel
          </a>
        }
      >
        <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
          <FormGroup
            errorMessages={form.fields.accountHolderLocation.errorMessages}
          >
            <RadioList>
              <RadioListItem
                id="unitedKingdom"
                name={fieldName}
                label="Yes, I live in the United Kingdom"
                value="unitedKingdom"
                defaultChecked={
                  form.fields.accountHolderLocation.value === "unitedKingdom"
                }
              />
              <RadioListItem
                id="restOfWorld"
                name={fieldName}
                label="No, I live somewhere else"
                value="restOfWorld"
                defaultChecked={
                  form.fields.accountHolderLocation.value === "restOfWorld"
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
      new WhenUserViewsPage_ThenDisplayPage(context),
      new WhenUserSubmitsUpdateAccountLocationChoiceForm_RedirectAccordingly(
        context,
        validationRules
      ),
    ]).execute();
  })
);

const validationRules = ({ accountHolderLocation }) => {
  return new FormManager({
    accountHolderLocation: new FieldManager(
      accountHolderLocation,
      [Validators.required("Select an option")],
      [],
      "unitedKingdom"
    ),
  });
};

class WhenUserSubmitsUpdateAccountLocationChoiceForm_RedirectAccordingly
  implements Rule
{
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
    switch ((await this.form()).accountHolderLocation) {
      case "unitedKingdom":
        return AccountPageURLs.updateAccountUnitedKingdom;
      case "restOfWorld":
        return AccountPageURLs.updateAccountRestOfWorld;
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

export default UpdateAccountLocationChoiceForm;
