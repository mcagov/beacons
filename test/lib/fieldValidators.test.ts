import {
  BeaconModelValidator,
  BeaconManufacturerValidator,
  BeaconHexIdValidator,
} from "../../src/lib/fieldValidators";

describe("BeaconModelValidator", () => {
  describe("validate", () => {
    it("returns 'invalid' response if value is empty string", () => {
      const beaconModelValidator = new BeaconModelValidator();
      const invalidValue = "";

      const validationResponse = beaconModelValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errors.length).toBe(1);
    });

    it("returns 'valid' response otherwise", () => {
      const beaconModelValidator = new BeaconModelValidator();
      const validValue = "not an empty string";

      const validationResponse = beaconModelValidator.validate(validValue);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errors.length).toBe(0);
    });
  });
});

describe("BeaconManufacturerValidator", () => {
  describe("validate", () => {
    it("returns false if value is empty string", () => {
      const beaconManufacturerValidator = new BeaconManufacturerValidator();
      const invalidValue = "";

      const validationResponse = beaconManufacturerValidator.validate(
        invalidValue
      );

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errors.length).toBe(1);
    });

    it("returns true otherwise", () => {
      const beaconManufacturerValidator = new BeaconManufacturerValidator();
      const validValue = "not an empty string";

      const validationResponse = beaconManufacturerValidator.validate(
        validValue
      );

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errors.length).toBe(0);
    });
  });
});

describe("BeaconHexIdValidator", () => {
  describe("validate", () => {
    it("returns false if value is empty string", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errors.length).toBe(1);
    });

    it("returns false if value is shorter than 15 characters", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "notquite15char";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errors.length).toBe(1);
    });

    it("returns false if value is longer than 15 characters", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const invalidValue = "bitlongerthanfifteencharacters";

      const validationResponse = beaconHexIdValidator.validate(invalidValue);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errors.length).toBe(1);
    });

    it("returns true otherwise", () => {
      const beaconHexIdValidator = new BeaconHexIdValidator();
      const validValue = "exactly15charac";

      const validationResponse = beaconHexIdValidator.validate(validValue);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errors.length).toBe(0);
    });
  });
});
