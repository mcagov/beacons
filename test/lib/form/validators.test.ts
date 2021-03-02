import { ValidatorFn, Validators } from "../../../src/lib/form/validators";

describe("Form Validators", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  describe("required", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.required(expectedErrorMessage));
    });

    it("should have an error if the value is an empty string", () => {
      expect(applies("")).toBe(true);
    });

    it("should have an error if the value is null", () => {
      expect(applies(null)).toBe(true);
    });

    it("should have an error if the value is undefined", () => {
      expect(applies(undefined)).toBe(true);
    });

    it("should not have an error if the value is non-empty", () => {
      expect(applies("Hex ID!")).toBe(false);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("maxLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.maxLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should not have an error if the value is less than the max length", () => {
      expect(applies("")).toBe(false);
    });

    it("should not have an error if the value is equal to the max length", () => {
      expect(applies("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(applies("a".repeat(11))).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("isLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.isLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should have an error if the value is less than the required length", () => {
      expect(applies("a")).toBe(true);
    });

    it("should not have an error if the value is equal to the required length", () => {
      expect(applies("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(applies("a".repeat(11))).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("hexId", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.hexId(expectedErrorMessage));
    });

    it("should have an error if no value is provided", () => {
      expect(applies("a")).toBe(false);
    });

    it("should return true if the value does not contain hexadecimal characters", () => {
      expect(applies("AR2")).toBe(true);
    });

    it("should not have an error if the value only contains characters A-F", () => {
      expect(applies("ABCDEF")).toBe(false);
    });

    it("should not have an error if the value only contains characters a-f", () => {
      expect(applies("abcdef")).toBe(false);
    });

    it("should not have an error if the value only contains characters 0-9", () => {
      expect(applies("0123456789")).toBe(false);
    });

    it("should not have an error if the value only contains contains characters 0-9, A-F", () => {
      expect(applies("0123456789abcdED")).toBe(false);
    });
  });

  describe("wholeNumber", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.wholeNumber(
        expectedErrorMessage
      ));
    });

    it("should not have an error if no value is provided", () => {
      expect(applies("")).toBe(false);
    });

    it("should not have an error if the value is a number", () => {
      expect(applies("12")).toBe(false);
    });

    it("should have an error if the value is a number and characters", () => {
      expect(applies("12abc")).toBe(true);
    });
  });

  xdescribe("email", () => {
    // TODO
  });
});
