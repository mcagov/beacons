import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { showCookieBanner } from "../../lib/cookies";
import { withoutErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { Rule } from "./Rule";

export class GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<
  T
> implements Rule
{
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
    return this.isHttpGetRequest();
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return await this.showFormWithoutErrors();
  }

  private isHttpGetRequest(): boolean {
    return this.context.req.method === "GET";
  }

  private async showFormWithoutErrors(): Promise<
    GetServerSidePropsResult<any>
  > {
    const draftRegistration = await this.draftRegistration();
    return {
      props: {
        form: withoutErrorMessages(
          this.mapper.draftRegistrationToForm(draftRegistration),
          this.validationRules
        ),
        showCookieBanner: showCookieBanner(this.context),
        ...(await this.additionalProps),
        draftRegistration,
      },
    };
  }

  private async draftRegistration(): Promise<DraftRegistration> {
    return await this.context.container.getDraftRegistration(
      this.draftRegistrationId()
    );
  }

  private draftRegistrationId(): string {
    return this.context.req.cookies[formSubmissionCookieId];
  }
}
