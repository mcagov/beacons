import { Actions } from "./Actions";
import { Pages } from "./Pages";
import { UsePages } from "./UsePages";

export class UrlBuilder {
  private static readonly topLevelPath = "/manage-my-registrations";

  public static buildRegistrationUrl(
    action: Actions,
    page: Pages,
    registrationId: string
  ): string {
    return `${this.topLevelPath}/${registrationId}/${action}/${page}`;
  }

  public static buildUseUrl(
    action: Actions,
    page: UsePages,
    registrationId: string,
    useId: string
  ): string {
    return `${this.topLevelPath}/${registrationId}/${action}/uses/${useId}/${page}`;
  }

  public static buildUseSummaryUrl(
    action: Actions,
    registrationId: string
  ): string {
    return `${this.topLevelPath}/${registrationId}/${action}/uses/${UsePages.summary}`;
  }

  public static buildUpdateRegistrationSummaryUrl(
    registrationId: string
  ): string {
    return `${this.topLevelPath}/${registrationId}/update`;
  }

  public static buildClaimLegacyBeaconUrl(legacyBeaconId: string): string {
    return `${this.topLevelPath}/claim-legacy-beacon/${legacyBeaconId}`;
  }
}
