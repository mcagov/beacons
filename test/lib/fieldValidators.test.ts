import {
  BeaconHexIdValidator,
  BeaconManufacturerValidator,
  BeaconModelValidator,
  MaritimePleasureVesselUseValidator,
} from "../../src/lib/fieldValidators";

describe("BeaconModelValidator", () => {
  describe("validate", () => {
    it("should return an 'invalid' response if value is empty string", () => {
      const beaconModelValidator = new BeaconModelValidator();
      const invalidValue = "";

      const validationResponse = beaconModelValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return 'valid' response otherwise", () => {
      const beaconModelValidator = new BeaconModelValidator();
      const validValue = "not an empty string";

      const validationResponse = beaconModelValidator.validate(validValue);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    });
  });
});

describe("BeaconManufacturerValidator", () => {
  describe("validate", () => {
    it("should return false if value is empty string", () => {
      const beaconManufacturerValidator = new BeaconManufacturerValidator();
      const invalidValue = "";

      const validationResponse = beaconManufacturerValidator.validate(
        invalidValue
      );

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return true otherwise", () => {
      const beaconManufacturerValidator = new BeaconManufacturerValidator();
      const validValue = "not an empty string";

      const validationResponse = beaconManufacturerValidator.validate(
        validValue
      );

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    });
  });
});

describe("BeaconHexIdValidator", () => {
  describe("validate", () => {
    it("should return false if value is empty string", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return false if value is shorter than 15 characters", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "notquite15char";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return false if value is longer than 15 characters", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "bitlongerthanfifteencharacters";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(1);
    });

    it("should return true otherwise", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const validValue = "exactly15charac";

      const validationResponse = beaconHexIdValidator.validate(validValue);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    });
  });
});

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
