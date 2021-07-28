import { BeaconUseFormMapper } from "./BeaconUseFormMapper";
import { RegistrationFormMapper } from "./RegistrationFormMapper";

export const makeDraftRegistrationMapper = <T>(
  useIndex: number,
  beaconUseMapper: BeaconUseFormMapper<T>
): RegistrationFormMapper<T> => ({
  formToDraftRegistration: (form) => {
    return {
      uses: new Array(useIndex >= 1 ? useIndex + 1 : 1)
        .fill({})
        .fill(
          beaconUseMapper.formToDraftBeaconUse(form),
          useIndex,
          useIndex + 1
        ),
    };
  },
  draftRegistrationToForm: (draftRegistration) => {
    return beaconUseMapper.beaconUseToForm(draftRegistration.uses[useIndex]);
  },
});
