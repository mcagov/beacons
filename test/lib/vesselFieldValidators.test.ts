import {
  VesselAreaOfOperationValidator,
  VesselBeaconLocationValidator,
  VesselMaxCapacityValidator,
} from "../../src/lib/fieldValidators";

describe("VesselMaxCapacityValidator", () => {
  describe("validate", () => {
    let vesselMaxCapacityValidator;

    beforeEach(() => {
      vesselMaxCapacityValidator = new VesselMaxCapacityValidator();
    });

    const assertHasErrorsForValue = (
      value: string,
      numberOfErrors: number
    ): void => {
      const validationResponse = vesselMaxCapacityValidator.validate(value);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(numberOfErrors);
    };

    const assertNoErrorsForValue = (value: string): void => {
      const validationResponse = vesselMaxCapacityValidator.validate(value);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    };

    it("should have an error if no value provided", () => {
      assertHasErrorsForValue("", 1);
    });

    it("should have an error if the value provided is not an integer", () => {
      assertHasErrorsForValue("abcde", 1);
    });

    it("should not have an error if an integer is provided", () => {
      assertNoErrorsForValue("12");
    });
  });
});

describe("VesselAreaOfOperationValidator", () => {
  describe("validate", () => {
    let vesselAreaOfOperationValidator;

    beforeEach(() => {
      vesselAreaOfOperationValidator = new VesselAreaOfOperationValidator();
    });

    const assertHasErrorsForValue = (
      value: string,
      numberOfErrors: number
    ): void => {
      const validationResponse = vesselAreaOfOperationValidator.validate(value);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(numberOfErrors);
    };

    const assertNoErrorsForValue = (value: string): void => {
      const validationResponse = vesselAreaOfOperationValidator.validate(value);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    };

    it("should not have an error if no value provided", () => {
      assertNoErrorsForValue("");
    });

    it("should not have an error the value provided is 250 characters or fewer", () => {
      assertNoErrorsForValue("a".repeat(250));
      assertNoErrorsForValue("a".repeat(100));
      assertNoErrorsForValue("a");
    });

    it("should have an error if the value provided has more than 250 characters", () => {
      assertHasErrorsForValue("a".repeat(251), 1);
    });
  });
});

describe("VesselBeaconLocationValidator", () => {
  describe("validate", () => {
    let vesselBeaconLocationValidator;

    beforeEach(() => {
      vesselBeaconLocationValidator = new VesselBeaconLocationValidator();
    });

    const assertHasErrorsForValue = (
      value: string,
      numberOfErrors: number
    ): void => {
      const validationResponse = vesselBeaconLocationValidator.validate(value);

      expect(validationResponse.valid).toBe(false);
      expect(validationResponse.errorMessages.length).toBe(numberOfErrors);
    };

    const assertNoErrorsForValue = (value: string): void => {
      const validationResponse = vesselBeaconLocationValidator.validate(value);

      expect(validationResponse.valid).toBe(true);
      expect(validationResponse.errorMessages.length).toBe(0);
    };

    it("should not have an error if no value provided", () => {
      assertNoErrorsForValue("");
    });

    it("should not have an error the value provided is 100 characters or fewer", () => {
      assertNoErrorsForValue("a".repeat(100));
      assertNoErrorsForValue("a");
    });

    it("should have an error if the value provided has more than 100 characters", () => {
      assertHasErrorsForValue("a".repeat(101), 1);
    });
  });
});
