import { ValidatorFn, Validators } from "../../../../src/lib/form/Validators";

describe("isInThePast validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.isInThePast(expectedErrorMessage));
  });

  it("should not have an error if the value is null", () => {
    expect(applies(null)).toBe(false);
  });

  it("should not have an error if the value is not a date string", () => {
    expect(applies("beacon information")).toBe(false);
  });

  it("should not have an error if the date is now", () => {
    expect(applies(new Date().toISOString())).toBe(false);
  });

  it("should not have an error if the date is in the past", () => {
    expect(applies(new Date().toISOString())).toBe(false);
  });

  it("should have an error if the date is in the future", () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    expect(applies(date.toISOString())).toBe(true);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
