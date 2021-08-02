import { GetServerSidePropsResult } from "next";
import { isValid, withErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { Rule } from "./Rule";

export class IfUserSubmittedInvalidRegistrationForm<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly mapper: RegistrationFormMapper<T>;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.additionalProps = additionalProps;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      !isValid(
        this.mapper.draftRegistrationToForm(
          this.mapper.formToDraftRegistration(
            await this.context.container.parseFormDataAs(this.context.req)
          )
        ),
        this.validationRules
      )
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    await this.context.container.saveDraftRegistration(
      this.draftRegistrationId(),
      await this.mapper.formToDraftRegistration(await this.form())
    );

    return {
      props: {
        form: withErrorMessages(
          await this.context.container.getDraftRegistration(
            this.draftRegistrationId()
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
