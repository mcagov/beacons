import { BeaconUseFormMapper } from "./BeaconUseFormMapper";
import { RegistrationFormMapper } from "./RegistrationFormMapper";

export const makeDraftRegistrationMapper = <T>(
  useIndex: number,
  beaconUseMapper: BeaconUseFormMapper<T>
): RegistrationFormMapper<T> => ({
  toDraftRegistration: (form) => {
    console.log("form: ", form);
    return {
      uses: new Array(useIndex > 1 ? useIndex - 1 : 1)
        .fill({})
        .fill(beaconUseMapper.toDraftBeaconUse(form), useIndex, useIndex + 1),
    };
  },
  toForm: (draftRegistration) => {
    console.log("draftRegistration: ", draftRegistration);
    return beaconUseMapper.toForm(draftRegistration.uses[useIndex]);
  },
});
