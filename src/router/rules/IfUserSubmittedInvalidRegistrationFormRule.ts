import { GetServerSidePropsResult } from "next";
import { isValid } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { presentRegistrationFormErrors } from "../../presenters/presentRegistrationFormErrors";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { Rule } from "./Rule";

export class IfUserSubmittedInvalidRegistrationFormRule<T> implements Rule {
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
        this.mapper.toForm(
          this.mapper.toDraftRegistration(
            await this.context.container.parseFormDataAs(this.context.req)
          )
        ),
        this.validationRules
      )
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return presentRegistrationFormErrors(
      await this.context.container.parseFormDataAs<T>(this.context.req),
      this.validationRules,
      this.mapper,
      {
        showCookieBanner: this.context.showCookieBanner || true,
        ...(await this.additionalProps),
      }
    );
  }
}
