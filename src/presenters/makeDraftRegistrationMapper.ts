import { BeaconUseFormMapper } from "./BeaconUseFormMapper";
import { DraftRegistrationFormMapper } from "./DraftRegistrationFormMapper";

/**
 * Creates a DraftRegistrationFormMapper capable of converting a
 * BeaconUse-concerned set of form data to a DraftRegistration.
 *
 * @remarks
 * When the user submits a page related to a BeaconUse, such as
 * VesselCommunications, the application needs to save the updated BeaconUse
 * fields to the DraftRegistration.
 *
 * But many BeaconUses are nested in the uses array of a DraftRegistration.
 * Which of the many BeaconUses in the uses array should be updated?
 *
 * The DraftRegistrationFormMapper created by this factory function solves this
 * problem using masking.
 *
 * To map a BeaconUse form submission to a DraftRegistration, it creates a
 * DraftRegistration with a uses array filled with empty uses up to the
 * specified useId.  The beaconUseFormMapper is then used to
 * map the form submission to a BeaconUse, which is inserted at the parameter
 * useId.
 *
 * For example, given a useId of 2 and a form submission of
 * { vhfRadio: true }, the created DraftRegistrationFormMapper's
 * formToDraftRegistration function would return a DraftRegistration that looks
 * like this:
 *
 * {
 *   uses: [{}, {}, { vhfRadio: true }]
 * }
 *
 * This can then be used to update an existing DraftRegistration via a merge
 * operation.
 *
 * @param useIndex The identifier of the BeaconUse being converted.
 * @param beaconUseFormMapper A BeaconUseFormMapper that converts a BeaconUse
 * entity to/from a form type, e.g. a VesselCommunicationsForm.
 * @returns DraftRegistrationFormMapper that converts a DraftRegistration
 * to/from a form type, e.g. a VesselCommunicationsForm.
 */
export const makeDraftRegistrationMapper = <T>(
  useIndex: number,
  beaconUseFormMapper: BeaconUseFormMapper<T>
): DraftRegistrationFormMapper<T> => ({
  formToDraftRegistration: (form) => {
    const emptyUse = {};

    return {
      uses: new Array(useIndex >= 1 ? useIndex + 1 : 1)
        .fill(emptyUse)
        .fill(
          beaconUseFormMapper.formToDraftBeaconUse(form),
          useIndex,
          useIndex + 1
        ),
    };
  },
  draftRegistrationToForm: (draftRegistration) => {
    return beaconUseFormMapper.beaconUseToForm(
      draftRegistration.uses[useIndex]
    );
  },
});
