import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("required validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

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

  it("should have an error if the value is just whitespace", () => {
    expect(applies(" ")).toBe(true);
  });

  it("should not have an error if the value is non-empty", () => {
    expect(applies("Hex ID!")).toBe(false);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
