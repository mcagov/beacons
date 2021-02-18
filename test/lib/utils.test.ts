import { ensureFormDataHasKeys, toArray } from "../../src/lib/utils";

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

describe("ensureFormDataHasKeys()", () => {
  describe("when given an incomplete Record", () => {
    it("should return a new Record with the missing keys as blank strings", () => {
      const input = { a: "a", b: "b" };
      const requiredKeys = ["a", "b", "missing"];
      const expectedOutput = { a: "a", b: "b", missing: "" };

      const output = ensureFormDataHasKeys(input, ...requiredKeys);

      expect(output).toEqual(expectedOutput);
    });

    it("should not mutate the input parameter", () => {
      const input = { a: "a", b: "b" };
      const requiredKeys = ["a", "b", "missing"];
      const expectedInput = { a: "a", b: "b" };

      ensureFormDataHasKeys(input, ...requiredKeys);

      expect(input).toEqual(expectedInput);
    });
  });
});
