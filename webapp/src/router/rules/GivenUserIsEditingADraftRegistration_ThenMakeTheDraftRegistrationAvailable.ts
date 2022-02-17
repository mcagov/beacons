import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { showCookieBanner } from "../../lib/cookies";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { Rule } from "./Rule";

export class GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly additionalProps: Record<string, any>;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    additionalProps?: Record<string, any>
  ) {
    this.context = context;
    this.additionalProps = additionalProps;
  }

  public async condition(): Promise<boolean> {
    return this.isHttpGetRequest();
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const draftRegistration = await this.draftRegistration();
    return {
      props: {
        showCookieBanner: showCookieBanner(this.context),
        ...(await this.additionalProps),
        draftRegistration,
      },
    };
  }

  private isHttpGetRequest(): boolean {
    return this.context.req.method === "GET";
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
