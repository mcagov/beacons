import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("ukEncodedBeacon validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.ukEncodedBeacon(
      expectedErrorMessage
    ));
  });

  it("should not have an error if no value is provided", () => {
    expect(applies("")).toBe(false);
    expect(applies(" ")).toBe(false);
  });

  it("should not error if the value does not look like a beacon hex Id", () => {
    expect(applies("not hexadecimal")).toBe(false);
    expect(applies("ABCDEF012")).toBe(false); // Hexadecimal but not 15 characters
  });

  it("should not have an error if a valid UK-encoded beacon is provided", () => {
    const validUkEncodedHexId = "1D0EA08C52FFBFF";
    expect(applies(validUkEncodedHexId)).toBe(false);
  });

  it("should error if a valid but not UK-encoded beacon is provided", () => {
    const validOtherCountryEncodedHexId = "C00F429578002C1";
    expect(applies(validOtherCountryEncodedHexId)).toBe(true);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
