import {
  emptyRequiredField,
  isNot15CharactersLong,
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

describe("isNot15CharactersLong", () => {
  it("should return false when field is 15 characters long", () => {
    expect(isNot15CharactersLong("123456789012345")).toBe(false);
    expect(isNot15CharactersLong("abcdefghijklmno")).toBe(false);
  });

  it("should return true when field is not 15 characters long", () => {
    expect(isNot15CharactersLong("abc")).toBe(true);
    expect(isNot15CharactersLong("abcdefghijklmnoasdkjahskjdhad")).toBe(true);
  });

  it("should return true when field is falsy", () => {
    expect(isNot15CharactersLong("")).toBe(true);
    expect(isNot15CharactersLong(undefined)).toBe(true);
    expect(isNot15CharactersLong(null)).toBe(true);
  });
});
