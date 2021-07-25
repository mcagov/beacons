import { DraftBeaconUse } from "../entities/DraftBeaconUse";

export interface BeaconUseFormMapper<T> {
  toDraftBeaconUse: (form: T) => DraftBeaconUse;
  toForm: (draftRegistration: DraftBeaconUse) => T;
}
