import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("maxLength validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

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
