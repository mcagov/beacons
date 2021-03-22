import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("hexadecimalString validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.hexadecimalString(
      expectedErrorMessage
    ));
  });

  it("should not have an error if no value is provided", () => {
    expect(applies("")).toBe(false);
    expect(applies("  ")).toBe(false);
  });

  it("should not have an error if the letter is hexadecimal", () => {
    expect(applies("a")).toBe(false);
  });

  it("should have an error if the value does not contain hexadecimal characters", () => {
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
