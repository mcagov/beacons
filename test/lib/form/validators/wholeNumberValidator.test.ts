import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("wholeNumber validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.wholeNumber(expectedErrorMessage));
  });

  it("should not have an error if no value is provided", () => {
    expect(applies("")).toBe(false);
    expect(applies("   ")).toBe(false);
  });

  it("should not have an error if the value is a number", () => {
    expect(applies("12")).toBe(false);
  });

  it("should have an error if the value is a number and characters", () => {
    expect(applies("12abc")).toBe(true);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
