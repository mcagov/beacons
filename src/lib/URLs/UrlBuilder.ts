import { Actions } from "./Actions";
import { Pages } from "./Pages";
import { UsePages } from "./UsePages";

export class UrlBuilder {
  public static buildRegistrationUrl(
    action: Actions,
    page: Pages,
    registrationId?: string
  ): string {
    return `/manage-my-registrations/${registrationId}/${action}/${page}`;
  }

  public static buildUseUrl(
    action: Actions,
    page: UsePages,
    registrationId: string,
    useId: number
  ): string {
    return `/manage-my-registrations/${registrationId}/${action}/use/${useId}/${page}`;
  }

  public static buildUseSummaryUrl(
    action: Actions,
    registrationId: string
  ): string {
    return `/manage-my-registrations/${registrationId}/${action}/use/${UsePages.summary}`;
  }
}
