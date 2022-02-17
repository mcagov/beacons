import { RecursivePartial } from "../lib/RecursivePartial";
import { DraftBeaconUse } from "./DraftBeaconUse";
import { Registration } from "./Registration";

export interface DraftRegistration extends RecursivePartial<Registration> {
  uses: DraftBeaconUse[];
}
