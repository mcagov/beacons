import { RecursivePartial } from "../utils/RecursivePartial";
import { DraftBeaconUse } from "./DraftBeaconUse";
import { IRegistration } from "./Registration";

export interface DraftRegistration extends RecursivePartial<IRegistration> {
  uses: DraftBeaconUse[];
}
