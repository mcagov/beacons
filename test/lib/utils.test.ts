import { toArray } from "../../src/lib/utils";

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
