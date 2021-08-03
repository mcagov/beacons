import { GetServerSidePropsResult } from "next";
import { isValid } from "../../lib/form/lib";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { PageURLs } from "../../lib/urls";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { Rule } from "./Rule";

export class IfUserSubmittedValidRegistrationForm<T> implements Rule {
  protected readonly context: BeaconsGetServerSidePropsContext;
  protected readonly validationRules: FormManagerFactory;
  protected readonly mapper: DraftRegistrationFormMapper<T>;
  private readonly nextPage: PageURLs | Promise<PageURLs>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    validationRules: FormManagerFactory,
    mapper: DraftRegistrationFormMapper<T>,
    nextPage: PageURLs | Promise<PageURLs>
  ) {
    this.context = context;
    this.validationRules = validationRules;
    this.mapper = mapper;
    this.nextPage = nextPage;
  }

  public async condition(): Promise<boolean> {
    const form = await this.context.container.parseFormDataAs(this.context.req);

    return (
      this.context.req.method === "POST" &&
      isValid(
        this.mapper.draftRegistrationToForm(
          this.mapper.formToDraftRegistration(form as T)
        ),
        this.validationRules
      )
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const form = await this.context.container.parseFormDataAs(this.context.req);

    await this.context.container.saveDraftRegistration(
      this.context.req.cookies["submissionId"],
      this.mapper.formToDraftRegistration(form as T)
    );

    return redirectUserTo(await this.nextPage);
  }
}
