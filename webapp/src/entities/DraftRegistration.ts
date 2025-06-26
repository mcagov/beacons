import { RecursivePartial } from "../lib/RecursivePartial";
import { DraftBeaconUse } from "./DraftBeaconUse";
import { Registration } from "./Registration";

export interface DraftRegistration extends RecursivePartial<Registration> {
  [key: string]: DraftBeaconUse[] | string | boolean;
  uses: DraftBeaconUse[];
}
