import { GetServerSidePropsResult } from "next";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { draftRegistrationId as id } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { UserSubmittedValidDraftRegistrationFormRule } from "./UserSubmittedValidDraftRegistrationFormRule";

export class UserSubmittedValidDraftRegistrationFormWithConditionalNextPagesRule<
  T
> extends UserSubmittedValidDraftRegistrationFormRule<T> {
  private readonly deriveNextPage: (
    context: BeaconsGetServerSidePropsContext
  ) => Promise<PageURLs>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: RegistrationFormMapper<T>,
    deriveNextPage: (
      context: BeaconsGetServerSidePropsContext
    ) => Promise<PageURLs>
  ) {
    super(context, validationRules, mapper);
    this.deriveNextPage = deriveNextPage;
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    await this.context.container.saveDraftRegistration(
      id(this.context),
      this.mapper.toDraftRegistration(
        await this.context.container.parseFormDataAs(this.context.req)
      )
    );

    return redirectUserTo(await this.deriveNextPage(this.context));
  }
}
