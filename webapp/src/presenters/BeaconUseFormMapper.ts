import { DraftBeaconUse } from "../entities/DraftBeaconUse";

export interface BeaconUseFormMapper<T> {
  formToDraftBeaconUse: (form: T) => DraftBeaconUse;
  beaconUseToForm: (draftBeaconUse: DraftBeaconUse) => T;
}
