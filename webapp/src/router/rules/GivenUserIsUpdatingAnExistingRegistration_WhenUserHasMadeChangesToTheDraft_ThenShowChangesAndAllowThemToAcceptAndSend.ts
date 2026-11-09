import { isEqual } from "lodash";
import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { Registration } from "../../entities/Registration";
import { showCookieBanner } from "../../lib/cookies";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { Rule } from "./Rule";

export class GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly registrationId: string;
  private existingRegistration: Registration;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    registrationId: string,
  ) {
    this.context = context;
    this.registrationId = registrationId;
  }

  public async condition(): Promise<boolean> {
    const {
      getAccountHoldersRegistration,
      getDraftRegistration,
      getAccountHolderId,
    } = this.context.container;

    const registrationId = this.context.params.registrationId as string;

    const draftRegistration: DraftRegistration =
      await getDraftRegistration(registrationId);

    if (!draftRegistration) return false;

    const accountHolderId: string = await getAccountHolderId(
      this.context.session,
    );

    this.existingRegistration = await getAccountHoldersRegistration(
      registrationId,
      accountHolderId,
    );

    return !isEqual(this.existingRegistration, draftRegistration);
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const { getDraftRegistration } = this.context.container;

    const registrationId: string = this.context.params.registrationId as string;
    const draft = await getDraftRegistration(registrationId);

    return {
      props: {
        showCookieBanner: showCookieBanner(this.context),
        userHasEdited: true,
        registration: {
          ...draft,
          registeredDate: this.existingRegistration.registeredDate,
          lastModifiedDate: this.existingRegistration.lastModifiedDate,
        },
      },
    };
  }
}
