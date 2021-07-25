import { GetServerSidePropsResult } from "next";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { presentDraftRegistration } from "../../presenters/presentDraftRegistration";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { Rule } from "./Rule";

export class UserViewedDraftRegistrationFormRule<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly mapper: RegistrationFormMapper<T>;
  private readonly props: any;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    props?: any
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.props = props;
  }

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET";
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return presentDraftRegistration<T>(
      await this.context.container.getDraftRegistration(
        this.context.req.cookies[formSubmissionCookieId]
      ),
      this.validationRules,
      this.mapper,
      {
        showCookieBanner: this.context.showCookieBanner,
        ...this.props,
      }
    );
  }
}
