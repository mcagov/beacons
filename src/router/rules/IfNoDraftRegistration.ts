import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs } from "../../lib/urls";
import { Rule } from "./Rule";

export class IfNoDraftRegistration implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return (
      this.draftRegistrationCookieIdIsMissing() ||
      (await this.draftRegistrationDoesNotExist())
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    if (this.draftRegistrationCookieIdIsMissing())
      return redirectUserTo(PageURLs.start);

    await this.createBlankDraftRegistration();

    return this.reloadPage();
  }

  private async createBlankDraftRegistration(): Promise<void> {
    const blankDraftRegistration: DraftRegistration = {
      uses: [],
    };

    await this.context.container.saveDraftRegistration(
      this.cookieId(),
      blankDraftRegistration
    );
  }

  private reloadPage() {
    return redirectUserTo(this.context.req.url);
  }

  private cookieId(): string {
    return this.context.req?.cookies[formSubmissionCookieId];
  }

  private draftRegistrationCookieIdIsMissing(): boolean {
    return !this.cookieId();
  }

  private async draftRegistrationDoesNotExist() {
    return !(await this.context.container.getDraftRegistration(
      this.cookieId()
    ));
  }
}
