import { ValidatorFn, Validators } from "../../../src/lib/form/validators";

describe("Form Validators", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let hasErrorFn: ValidatorFn;

  describe("required", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.required(
        expectedErrorMessage
      ));
    });

    it("should have an error if the value is an empty string", () => {
      expect(hasErrorFn("")).toBe(true);
    });

    it("should have an error if the value is null", () => {
      expect(hasErrorFn(null)).toBe(true);
    });

    it("should have an error if the value is undefined", () => {
      expect(hasErrorFn(undefined)).toBe(true);
    });

    it("should not have an error if the value is non-empty", () => {
      expect(hasErrorFn("Hex ID!")).toBe(false);
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
      expect(hasErrorFn("")).toBe(false);
    });

    it("should not have an error if the value is equal to the max length", () => {
      expect(hasErrorFn("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(hasErrorFn("a".repeat(11))).toBe(true);
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
      expect(hasErrorFn("a")).toBe(true);
    });

    it("should not have an error if the value is equal to the required length", () => {
      expect(hasErrorFn("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(hasErrorFn("a".repeat(11))).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  xdescribe("email", () => {
    // TODO
  });

  describe("hexId", () => {
    beforeEach(() => {
      ({ errorMessage, hasErrorFn } = Validators.hexId(expectedErrorMessage));
    });

    it("should have an error if no value is provided", () => {
      expect(hasErrorFn("")).toBe(false);
    });

    it("should return true if the value is not hexadecimal characters", () => {
      expect(hasErrorFn("AR2")).toBe(true);
    });

    it("should have an error if the value does not contain hexadecimal characters", () => {
      expect(hasErrorFn("AR2")).toBe(true);
    });

    it("should not have an error if the value only contains characters A-F", () => {
      expect(hasErrorFn("ABCDEF")).toBe(false);
    });

    it("should not have an error if the value only contains characters a-f", () => {
      expect(hasErrorFn("abcdef")).toBe(false);
    });

    it("should not have an error if the value only contains characters 0-9", () => {
      expect(hasErrorFn("0123456789")).toBe(false);
    });
  });
});
