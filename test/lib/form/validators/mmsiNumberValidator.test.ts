import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("isLength validator", () => {
  const expectedErrorMessage = "is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.mmsiNumber(expectedErrorMessage));
  });

  it("should require numbers only", () => {
    expect(applies("abcdefghj")).toBe(true);
  });

  it("should require length to be exactly 9", () => {
    expect(applies("123456789")).toBe(false);
    expect(applies("12345678910")).toBe(true);
    expect(applies("123")).toBe(true);
  });

  it("should disregard whitespace", () => {
    expect(applies("235 762000")).toBe(false);
    expect(applies("235    762000")).toBe(false);
    expect(applies("2357 620  00 ")).toBe(false);
  });
});
