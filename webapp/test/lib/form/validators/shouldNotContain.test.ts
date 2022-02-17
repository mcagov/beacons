import { ValidatorFn, Validators } from "../../../../src/lib/form/Validators";

describe("shouldNotContain validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  it("should error if value contains something it shouldn't", () => {
    ({ errorMessage, applies } = Validators.shouldNotContain(
      expectedErrorMessage,
      "O"
    ));

    expect(applies("contains an O")).toBe(true);
  });

  it("should error if value contains something else it shouldn't", () => {
    ({ errorMessage, applies } = Validators.shouldNotContain(
      expectedErrorMessage,
      "XXX"
    ));

    expect(applies("contains XXX")).toBe(true);
  });

  it("should error if value contains something else it shouldn't", () => {
    ({ errorMessage, applies } = Validators.shouldNotContain(
      expectedErrorMessage,
      "verboten string"
    ));

    expect(applies("verboten string is a great restaurant")).toBe(true);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
