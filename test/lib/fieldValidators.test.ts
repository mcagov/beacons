import {
  BeaconHexIdValidator,
  BeaconManufacturerValidator,
  BeaconModelValidator,
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
    let beaconHexIdValidator;

    beforeEach(() => {
      beaconHexIdValidator = new BeaconHexIdValidator();
    });

    const assertHasErrors = (value: string, numberOfErrors: number): void => {
      const validationResponse = beaconHexIdValidator.validate(value);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(numberOfErrors);
    };

    const assertNoErrors = (value: string): void => {
      const validationResponse = beaconHexIdValidator.validate(value);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    };

    it("should have errors if no value provided", () => {
      assertHasErrors("", 2);
    });

    it("should have an error if the value is shorter than 15 characters", () => {
      assertHasErrors("123456879", 1);
    });

    it("should have an error if the value contains non hex characters but is 15 characters long", () => {
      assertHasErrors("0a1b2c3d4e5fa6x", 1);
    });

    it("should have an error if the value is longer than 15 characters", () => {
      assertHasErrors("0123456789123456789", 1);
    });

    it("should return true if only 15 numbers", () => {
      assertNoErrors("123456789123456");
    });

    it("should not have any errors if it is only non-number 15 hex characters", () => {
      assertNoErrors("abcdefabcdefabc");
    });

    it("should not have any errors if 15 hex characters", () => {
      assertNoErrors("0a1b2c3d4e5fa6b");
    });

    it("should ignore casing of hex characters", () => {
      assertNoErrors("ABCDeFabCDefABc");
    });
  });
});
