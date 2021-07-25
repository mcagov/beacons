import { GetServerSidePropsResult } from "next";
import { isValid } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { draftRegistrationId as id } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { Rule } from "./Rule";

export class UserSubmittedValidDraftRegistrationFormRule<T> implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly validationRules: FormManagerFactory;
  private readonly mapper: RegistrationFormMapper<T>;
  private readonly nextPage: PageURLs;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    nextPage: PageURLs
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.nextPage = nextPage;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req.method === "POST" &&
      isValid<T>(
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
    await this.context.container.saveDraftRegistration(
      id(this.context),
      this.mapper.toDraftRegistration(
        await this.context.container.parseFormDataAs(this.context.req)
      )
    );

    return redirectUserTo(this.nextPage);
  }
}
