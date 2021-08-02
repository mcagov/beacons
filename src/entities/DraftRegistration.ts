import { RecursivePartial } from "../lib/RecursivePartial";
import { DraftBeaconUse } from "./DraftBeaconUse";
import { IRegistration } from "./Registration";

export interface DraftRegistration extends RecursivePartial<IRegistration> {
  uses: DraftBeaconUse[];
}
