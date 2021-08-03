import { ValidatorFn, Validators } from "../../../../src/lib/form/Validators";

describe("minDateYear validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.minDateYear(
      expectedErrorMessage,
      2000
    ));
  });

  it("should not have an error if the value is null", () => {
    expect(applies(null)).toBe(false);
  });

  it("should not have an error if the value is not a date string", () => {
    expect(applies("beacon information")).toBe(false);
  });

  it("should not have an error if the date is greater than the minimum year", () => {
    expect(applies(new Date().toISOString())).toBe(false);
  });

  it("should have an error if the date is before the minimum year", () => {
    expect(applies(new Date(1999, 0, 0).toISOString())).toBe(true);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
