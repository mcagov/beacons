import { DraftRegistration } from "../../entities/DraftRegistration";
import { LegacyBeacon } from "../../entities/LegacyBeacon";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { CreateRegistrationPageURLs, queryParams } from "../../lib/urls";
import { UrlBuilder } from "../../lib/URLs/UrlBuilder";
import { Rule } from "./Rule";

export class GivenUserSelectsClaim_WhenUserSubmitsForm_ThenPromptUserToUpdateTheirClaimedBeacon
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly legacyBeaconId: string;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    legacyBeaconId: string
  ) {
    this.context = context;
    this.legacyBeaconId = legacyBeaconId;
  }

  public async condition(): Promise<boolean> {
    const form = (await this.context.container.parseFormDataAs(
      this.context.req
    )) as any;

    return form.claimResponse === "claim";
  }

  public async action(): Promise<any> {
    const { legacyBeaconGateway } = this.context.container;

    const legacyBeacon = await legacyBeaconGateway.getById(this.legacyBeaconId);

    await this.prePopulateTheDraftRegistrationWithMigratedDetails(legacyBeacon);

    return redirectUserTo(
      CreateRegistrationPageURLs.beaconInformation +
        queryParams({
          previous: UrlBuilder.buildClaimLegacyBeaconUrl(legacyBeacon.id),
        })
    );
  }

  private async prePopulateTheDraftRegistrationWithMigratedDetails(
    legacyBeacon: LegacyBeacon
  ): Promise<void> {
    const migratedDraftRegistration: DraftRegistration = {
      hexId: legacyBeacon.hexId,
      manufacturer: legacyBeacon.manufacturer,
      model: legacyBeacon.model,
      uses: [],
    };

    await this.context.container.saveDraftRegistration(
      this.cookieId(),
      migratedDraftRegistration
    );
  }

  private cookieId(): string {
    return this.context.req?.cookies[formSubmissionCookieId];
  }
}
