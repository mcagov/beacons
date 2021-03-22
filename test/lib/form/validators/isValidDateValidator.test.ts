import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("isValidDate validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.isValidDate(expectedErrorMessage));
  });

  it("should have an error if the value is null", () => {
    expect(applies(null)).toBe(true);
  });

  it("should have an error if the not a date string", () => {
    expect(applies("beacon information")).toBe(true);
  });

  it("should not have an error if the value is a valid date string", () => {
    expect(applies(new Date().toISOString())).toBe(false);
  });
});
