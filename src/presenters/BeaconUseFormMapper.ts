import { DraftBeaconUse } from "../entities/DraftBeaconUse";

export interface BeaconUseFormMapper<T> {
  toDraftBeaconUse: (form: T) => DraftBeaconUse;
  toForm: (draftBeaconUse: DraftBeaconUse) => T;
}
