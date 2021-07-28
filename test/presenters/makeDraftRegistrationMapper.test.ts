import { DraftRegistration } from "../../src/entities/DraftRegistration";
import { Environment } from "../../src/lib/registration/types";
import { BeaconUseFormMapper } from "../../src/presenters/BeaconUseFormMapper";
import { makeDraftRegistrationMapper } from "../../src/presenters/makeDraftRegistrationMapper";

describe("makeDraftRegistrationMapper", () => {
  describe("formToDraftRegistration", () => {
    it("given a useIndex and a BeaconUseFormMapper, returns a function that maps BeaconUse form properties to a DraftRegistration", () => {
      const useIndex = 0;
      const beaconUseForm = {
        environment: Environment.LAND,
      };
      const beaconUseFormMapper: BeaconUseFormMapper<typeof beaconUseForm> = {
        beaconUseToForm: (draftBeaconUse) => ({
          environment: draftBeaconUse.environment as Environment,
        }),
        formToDraftBeaconUse: (form) => ({
          environment: form.environment,
        }),
      };
      const draftRegistrationMapper = makeDraftRegistrationMapper(
        useIndex,
        beaconUseFormMapper
      );
      const draftRegistration: DraftRegistration =
        draftRegistrationMapper.formToDraftRegistration(beaconUseForm);

      expect(draftRegistration).toStrictEqual({
        uses: [{ environment: Environment.LAND }],
      });
    });

    it("does the same when there are two uses", () => {
      const useIndex = 1;
      const beaconUseForm = {
        environment: Environment.LAND,
      };
      const beaconUseFormMapper: BeaconUseFormMapper<typeof beaconUseForm> = {
        beaconUseToForm: (draftBeaconUse) => ({
          environment: draftBeaconUse.environment as Environment,
        }),
        formToDraftBeaconUse: (form) => ({
          environment: form.environment,
        }),
      };
      const draftRegistrationMapper = makeDraftRegistrationMapper(
        useIndex,
        beaconUseFormMapper
      );
      const draftRegistration: DraftRegistration =
        draftRegistrationMapper.formToDraftRegistration(beaconUseForm);

      expect(draftRegistration).toStrictEqual({
        uses: [{}, { environment: Environment.LAND }],
      });
    });

    it("and three uses", () => {
      const useIndex = 2;
      const beaconUseForm = {
        environment: Environment.LAND,
      };
      const beaconUseFormMapper: BeaconUseFormMapper<typeof beaconUseForm> = {
        beaconUseToForm: (draftBeaconUse) => ({
          environment: draftBeaconUse.environment as Environment,
        }),
        formToDraftBeaconUse: (form) => ({
          environment: form.environment,
        }),
      };
      const draftRegistrationMapper = makeDraftRegistrationMapper(
        useIndex,
        beaconUseFormMapper
      );
      const draftRegistration: DraftRegistration =
        draftRegistrationMapper.formToDraftRegistration(beaconUseForm);

      expect(draftRegistration).toStrictEqual({
        uses: [{}, {}, { environment: Environment.LAND }],
      });
    });
  });
});
