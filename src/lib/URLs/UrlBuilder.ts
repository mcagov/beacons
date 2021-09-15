import { Actions } from "./Actions";
import { Pages } from "./Pages";
import { Resources } from "./Resources";
import { UsePages } from "./UsePages";

export class UrlBuilder {
  public static build(
    resourceType: Resources,
    action: Actions,
    page: Pages | UsePages,
    resourceId?: string
  ): string {
    return `/${resourceType}/${resourceId}/${action}/${page}`;
  }
}
