import { BeaconManufacturerValidator } from "../../../src/lib/field-validators/beaconFieldValidators";
import { FieldValidator } from "../../../src/lib/fieldValidator";

describe("Beacon Information Validators", () => {
  let validator: FieldValidator;

  const assertHasErrorsForValue = (
    value: string,
    numberOfErrors: number
  ): void => {
    const validationResponse = validator.validate(value);

    expect(validationResponse.valid).toBe(false);
    expect(validationResponse.errorMessages.length).toBe(numberOfErrors);
  };

  const assertNoErrorsForValue = (value: string): void => {
    const validationResponse = validator.validate(value);

    expect(validationResponse.valid).toBe(true);
    expect(validationResponse.errorMessages.length).toBe(0);
  };

  describe("BeaconManufacturerSerialNumberValidator", () => {
    beforeEach(() => {
      validator = new BeaconManufacturerValidator();
    });

    it("should have an error if no value is provided", () => {
      assertHasErrorsForValue("", 1);
    });

    it("should not have an error if a value is provided", () => {
      assertNoErrorsForValue("Beacon manufacturer serial number");
    });
  });
});
