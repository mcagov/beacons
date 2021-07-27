import { IRegistration } from "../lib/registration/types";
import { RecursivePartial } from "../utils/RecursivePartial";
import { DraftBeaconUse } from "./DraftBeaconUse";

export interface DraftRegistration extends RecursivePartial<IRegistration> {
  uses: DraftBeaconUse[];
}
