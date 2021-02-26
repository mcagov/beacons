import { AbstractControl } from "../../../src/lib/form/abstractControl";
import { ValidatorFn, Validators } from "../../../src/lib/form/validators";

describe("Form Validators", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let hasErrorFn: ValidatorFn;

  class ControlWithValue extends AbstractControl {
    constructor(value: string) {
      super(value, []);
    }
    public get value() {
      return this._value;
    }
  }

  const controlWithValue = (value) => new ControlWithValue(value);

  describe("required", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.required(
        expectedErrorMessage
      ));
    });

    it("should have an error if the value is an empty string", () => {
      const control = controlWithValue("");
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should have an error if the value is null", () => {
      const control = controlWithValue(null);
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should have an error if the value is undefined", () => {
      const control = controlWithValue(undefined);
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should not have an error if the value is non-empty", () => {
      const control = controlWithValue("Hex ID!");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("max", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.max(expectedErrorMessage, 10));
    });

    it("should not have an error if the value is less than the max length", () => {
      const control = controlWithValue("");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should not have an error if the value is equal to the max length", () => {
      const control = controlWithValue("a".repeat(10));
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      const control = controlWithValue("a".repeat(11));
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("isSize", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.isSize(
        expectedErrorMessage,
        10
      ));
    });

    it("should have an error if the value is less than the required length", () => {
      const control = controlWithValue("a");
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should not have an error if the value is equal to the required length", () => {
      const control = controlWithValue("a".repeat(10));
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      const control = controlWithValue("a".repeat(11));
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("hexId", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.hexId(expectedErrorMessage));
    });

    it("should have an error if no value is provided", () => {
      const control = controlWithValue("a");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should return true if the value does not contain hexadecimal characters", () => {
      const control = controlWithValue("AR2");
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should not have an error if the value only contains characters A-F", () => {
      const control = controlWithValue("ABCDEF");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should not have an error if the value only contains characters a-f", () => {
      const control = controlWithValue("abcdef");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should not have an error if the value only contains characters 0-9", () => {
      const control = controlWithValue("0123456789");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should not have an error if the value only contains contains characters 0-9, A-F", () => {
      const control = controlWithValue("0123456789abcdED");
      expect(hasErrorFn(control)).toBe(false);
    });
  });

  describe("wholeNumber", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.wholeNumber(
        expectedErrorMessage
      ));
    });

    it("should have an error if no value is provided", () => {
      const control = controlWithValue("");
      expect(hasErrorFn(control)).toBe(true);
    });

    it("should not have an error if the value is a number", () => {
      const control = controlWithValue("12");
      expect(hasErrorFn(control)).toBe(false);
    });

    it("should have an error if the value is a number and characters", () => {
      const control = controlWithValue("12abc");
      expect(hasErrorFn(control)).toBe(true);
    });
  });

  xdescribe("email", () => {
    // TODO
  });
});
