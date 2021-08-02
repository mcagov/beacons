import { GetServerSidePropsResult } from "next";
import { isValid, withErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { Rule } from "./Rule";

export class IfUserSubmittedInvalidRegistrationForm<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly mapper: DraftRegistrationFormMapper<T>;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: DraftRegistrationFormMapper<T>,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.additionalProps = additionalProps;
  }

  public async condition(): Promise<boolean> {
    return this.userSubmittedForm() && (await this.formIsInvalid());
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    await this.saveDraftRegistration();

    return await this.showFormWithErrorMessages();
  }

  private userSubmittedForm(): boolean {
    return this.context.req.method === "POST";
  }

  private async formIsInvalid(): Promise<boolean> {
    return !isValid(
      this.mapper.draftRegistrationToForm(
        this.mapper.formToDraftRegistration(
          await this.context.container.parseFormDataAs(this.context.req)
        )
      ),
      this.validationRules
    );
  }

  private async saveDraftRegistration(): Promise<void> {
    await this.context.container.saveDraftRegistration(
      this.draftRegistrationId(),
      await this.mapper.formToDraftRegistration(await this.form())
    );
  }

  private async showFormWithErrorMessages(): Promise<
    GetServerSidePropsResult<any>
  > {
    return {
      props: {
        form: withErrorMessages(
          this.mapper.draftRegistrationToForm(
            await this.context.container.getDraftRegistration(
              this.draftRegistrationId()
            )
          ),
          this.validationRules
        ),
        ...(await this.additionalProps),
      },
    };
  }

  private draftRegistrationId(): string {
    return this.context.req.cookies[formSubmissionCookieId];
  }

  private async form(): Promise<T> {
    return await this.context.container.parseFormDataAs<T>(this.context.req);
  }
}
