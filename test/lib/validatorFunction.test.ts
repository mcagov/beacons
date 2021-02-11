import {
  emptyRequiredField,
  containsNonHexChar,
} from "../../src/lib/validatorFunctions";

describe("emptyRequiredField", () => {
  it("should return true when field is an empty string", () => {
    expect(emptyRequiredField("")).toBe(true);
  });

  it("should return true when field is undefined", () => {
    expect(emptyRequiredField(undefined)).toBe(true);
  });

  it("should return true when field is null", () => {
    expect(emptyRequiredField(null)).toBe(true);
  });

  it("should return false when field is a string of one or more character", () => {
    expect(emptyRequiredField("Space")).toBe(false);
    expect(emptyRequiredField("Jam")).toBe(false);
  });

  it("should return false when field is a string of a number", () => {
    expect(emptyRequiredField("42")).toBe(false);
  });
});

describe("containsNonHexCharacter", () => {
  it("should return true when field contains a valid hexadecimal character", () => {
    expect(containsNonHexChar("0")).toBe(true);
    expect(containsNonHexChar("1")).toBe(true);
    expect(containsNonHexChar("f")).toBe(true);
  });
});
