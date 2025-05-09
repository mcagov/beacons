import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { Rule } from "./Rule";
import { isValidUse } from "../../lib/helpers/isValidUse";
import { showCookieBanner } from "../../lib/cookies";

export class GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeInvalidChangesToTheDraft_ThenRemoveInvalidChanges
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly registrationId: string;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    registrationId: string,
  ) {
    this.context = context;
    this.registrationId = registrationId;
  }

  public async condition(): Promise<boolean> {
    const draftRegistration: DraftRegistration = await this.draftRegistration();

    return !!draftRegistration;
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    if (await this.formIsInvalid()) {
      await this.removeCachedInvalidUse();
    }

    return {
      props: {
        showCookieBanner: showCookieBanner(this.context),
        userHasEdited: true,
        registration: await this.draftRegistration(),
      },
    };
  }

  private async formIsInvalid(): Promise<boolean> {
    return (
      (await this.draftRegistration())?.uses?.filter((use) => !isValidUse(use))
        .length > 0
    );
  }

  private async draftRegistration(): Promise<DraftRegistration> {
    return await this.context.container.getDraftRegistration(
      this.registrationId,
    );
  }

  private async removeCachedInvalidUse(): Promise<void> {
    await this.context.container.draftRegistrationGateway.removeInvalidUse(
      this.registrationId,
    );
  }
}
