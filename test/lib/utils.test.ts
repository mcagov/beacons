import { toArray } from "../../src/lib/utils";
import {
  makeEnumValueUserFriendly,
  padNumberWithLeadingZeros,
  stringToBoolean,
  toUpperCase,
} from "../../src/lib/writingStyle";

describe("to array function", () => {
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

describe("to upper case function", () => {
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

describe("make enum value user friendly function", () => {
  it("should return the value unchanged if the value is null", () => {
    expect(makeEnumValueUserFriendly(null)).toBe(null);
  });

  it("should return the value sentence-cased", () => {
    expect(makeEnumValueUserFriendly("UPPERCASE")).toBe("Uppercase");
  });

  it("should replace underscores with spaces and return the value sentence-cased", () => {
    expect(makeEnumValueUserFriendly("UPPER_CASE")).toBe("Upper case");
  });
});

describe("pad number with leading zeros function", () => {
  it("should not pad an empty string", () => {
    expect(padNumberWithLeadingZeros("")).toBe("");
  });

  it("should pad a number with a leading zero", () => {
    expect(padNumberWithLeadingZeros("0")).toBe("00");
  });

  it("should pad all numbers from 0-9 with a leading zero", () => {
    for (let i = 0; i < 10; ++i) {
      const numberAsString = `${i}`;
      const leadingZero = "0";
      expect(padNumberWithLeadingZeros(numberAsString)).toBe(
        `${leadingZero}${numberAsString}`
      );
    }
  });

  it("should not pad the number if the length is equal to the padding length", () => {
    expect(padNumberWithLeadingZeros("10")).toBe("10");
  });

  it("should not pad the number if the length is greater than the padding length", () => {
    expect(padNumberWithLeadingZeros("100")).toBe("100");
  });

  it("should pad the number with the specified padding", () => {
    expect(padNumberWithLeadingZeros("7", 3)).toBe("007");
  });

  it("should not pad a word", () => {
    expect(padNumberWithLeadingZeros("beacon")).toBe("beacon");
  });
});

describe("string to boolean function", () => {
  it("should return false if null", () => {
    expect(stringToBoolean(null)).toBe(false);
  });

  it("should return false if undefined", () => {
    expect(stringToBoolean(undefined)).toBe(false);
  });

  it("should return true if the value is TRUE", () => {
    expect(stringToBoolean("TRUE")).toBe(true);
  });

  it("should return true if the value is true", () => {
    expect(stringToBoolean("true")).toBe(true);
  });

  it("should return false if the value is false", () => {
    expect(stringToBoolean("false")).toBe(false);
  });
});
