import { GetServerSidePropsResult } from "next";
import { withoutErrorMessages } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { acceptRejectCookieId, formSubmissionCookieId } from "../../lib/types";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { Rule } from "./Rule";

export class UserViewedDraftRegistrationFormRule<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly mapper: RegistrationFormMapper<T>;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    additionalProps: Record<string, any>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.additionalProps = additionalProps;
  }

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const { getDraftRegistration } = this.context.container;

    const id = this.context.req.cookies[formSubmissionCookieId];

    return {
      props: {
        form: withoutErrorMessages<T>(
          this.mapper.toForm(await getDraftRegistration(id)),
          this.validationRules
        ),
        showCookieBanner:
          this.context.req.cookies[acceptRejectCookieId] || true,
        ...(await this.additionalProps),
      },
    };
  }
}
