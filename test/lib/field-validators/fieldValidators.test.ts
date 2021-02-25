import {
  MaritimePleasureVesselUseValidator,
  OtherPleasureVesselTextValidator,
} from "../../../src/lib/field-validators";

describe("MaritimePleasureVesselUseValidator", () => {
  describe("validate", () => {
    it("should return false if value is an empty string", () => {
      const maritimePleasureVesselUseValidator = new MaritimePleasureVesselUseValidator();
      const invalidValue = "";

      const validationResponse = maritimePleasureVesselUseValidator.validate(
        invalidValue
      );

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return false if value is not in the enum", () => {
      const maritimePleasureVesselUseValidator = new MaritimePleasureVesselUseValidator();
      const invalidValues = ["PARACHUTE", "TOBOGGAN", "SNOW PLOUGH", "BICYCLE"];

      invalidValues.forEach((invalidValue) => {
        const validationResponse = maritimePleasureVesselUseValidator.validate(
          invalidValue
        );

        expect(validationResponse.valid).toBe(false);
        expect(validationResponse.errorMessages.length).toBe(1);
      });
    });
  });
});

describe("OtherPleasureVesselTextValidator", () => {
  describe("validate", () => {
    xit("should return false if value is an empty string", () => {
      // Skipped pending implementation of conditional form validation
      // (e.g. only validate X if radio button Y is checked)
      const otherPleasureVesselTextValidator = new OtherPleasureVesselTextValidator();
      const invalidValue = "";

      const validationResponse = otherPleasureVesselTextValidator.validate(
        invalidValue
      );

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });
  });
});
