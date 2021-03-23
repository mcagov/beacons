import { ValidatorFn, Validators } from "../../../../src/lib/form/validators";

describe("phoneNumber validator", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  beforeEach(() => {
    ({ errorMessage, applies } = Validators.phoneNumber(expectedErrorMessage));
  });

  it("should error for obviously invalid phone numbers", () => {
    expect(applies("i am not a phone number")).toBe(true);
    expect(applies("0121 D0 0NE")).toBe(true);
    expect(applies("+44       ")).toBe(true);
  });

  it("should not error for UK mobile numbers", () => {
    expect(applies("07712 345678")).toBe(false);
    expect(applies("+447712 345678")).toBe(false);
  });

  it("should not error for valid satellite numbers", () => {
    expect(applies("+881612345678")).toBe(false);
    expect(applies("+870773166238")).toBe(false);
    expect(applies("+881677722191")).toBe(false);
    expect(applies("+8821663225558")).toBe(false);
  });

  it("should permit spaces", () => {
    expect(applies("077 12 345 678")).toBe(false);
    expect(applies("+44 77 12 345 67 8")).toBe(false);
    expect(applies("+8 8161 234 56 78")).toBe(false);
    expect(applies("+87 07731 66 238")).toBe(false);
    expect(applies("+88 167 772 21     91")).toBe(false);
    expect(applies("+ 882   1663225558")).toBe(false);
  });

  it("should permit dashes and hyphens", () => {
    expect(applies("07712-345-678")).toBe(false);
    expect(applies("+44-7712345-678")).toBe(false);
    expect(applies("+8816 - 12345678")).toBe(false);
  });

  it("should permit brackets", () => {
    expect(applies("(0)7712345678")).toBe(false);
    expect(applies("(+44) 7712345678")).toBe(false);
    expect(applies("(+8816)12345678")).toBe(false);
  });

  it("should permit '00' instead of '+' for country codes", () => {
    expect(applies("00447712345678")).toBe(false);
    expect(applies("008816-12345678")).toBe(false);
  });

  it("should return the expected error message", () => {
    expect(expectedErrorMessage).toBe(errorMessage);
  });
});
