import { toArray, toUpperCase } from "../../src/lib/utils";

describe("toArray()", () => {
  it("should convert a number to an array", () => {
    expect(toArray(1)).toStrictEqual([1]);
  });

  it("should return the array of numbers", () => {
    expect(toArray([1])).toStrictEqual([1]);
  });

  it("should convert a string to an array of a string", () => {
    expect(toArray("beacon")).toStrictEqual(["beacon"]);
  });

  it("should filter out null values in the array", () => {
    expect(toArray(["beacon", null, null, "beacon-2"])).toStrictEqual([
      "beacon",
      "beacon-2",
    ]);
  });

  it("should filter out undefined values in the array", () => {
    expect(toArray(["beacon", void 0, "beacon-2", void 0])).toStrictEqual([
      "beacon",
      "beacon-2",
    ]);
  });
});

describe("toUpperCase()", () => {
  it("should return an empty string if the value is null", () => {
    expect(toUpperCase(null)).toBe("");
  });

  it("should return an empty string if the value is undefined", () => {
    expect(toUpperCase(undefined)).toBe("");
  });

  it("should convert the string to uppercase", () => {
    expect(toUpperCase("beacon")).toBe("BEACON");
  });

  it("should uppercase a mix of characters and numbers", () => {
    expect(toUpperCase("abc123")).toBe("ABC123");
  });

  it("should handle only numbers", () => {
    expect(toUpperCase("123")).toBe("123");
  });
});
