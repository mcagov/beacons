import { isEqual } from "lodash";
import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { Registration } from "../../entities/Registration";
import { showCookieBanner } from "../../lib/cookies";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { Rule } from "./Rule";

export class GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly registrationId: string;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    registrationId: string
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

    const registrationId: string = this.context.query.id as string;

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      registrationId
    );

    if (!draftRegistration) return true;

    const accountHolderId: string = await getAccountHolderId(
      this.context.session
    );

    const existingRegistration: Registration =
      await getAccountHoldersRegistration(registrationId, accountHolderId);

    return isEqual(existingRegistration, draftRegistration);
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    console.log("showing without changes");
    const { getAccountHoldersRegistration, getAccountHolderId } =
      this.context.container;

    const registrationId: string = this.context.query.registrationId as string;

    const accountHolderId: string = await getAccountHolderId(
      this.context.session
    );

    const existingRegistration: Registration =
      await getAccountHoldersRegistration(registrationId, accountHolderId);

    return {
      props: {
        showCookieBanner: showCookieBanner(this.context),
        userHasEdited: false,
        registration: existingRegistration,
      },
    };
  }
}
