import { BeaconUseFormMapper } from "./BeaconUseFormMapper";
import { RegistrationFormMapper } from "./RegistrationFormMapper";

export const makeRegistrationMapper = <T>(
  useIndex: number,
  beaconUseMapper: BeaconUseFormMapper<T>
): RegistrationFormMapper<T> => ({
  toDraftRegistration: (form) => {
    return {
      uses: new Array(useIndex > 1 ? useIndex - 1 : 1)
        .fill({})
        .fill(beaconUseMapper.toDraftBeaconUse(form), useIndex, useIndex + 1),
    };
  },
  toForm: (draftRegistration) => {
    return beaconUseMapper.toForm(draftRegistration.uses[useIndex]);
  },
});
