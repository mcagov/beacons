import {
  formatUrlQueryParams,
  makeEnumValueUserFriendly,
  padNumberWithLeadingZeros,
  toArray,
  toUpperCase,
} from "../../src/lib/utils";

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

describe("makeEnumValueUserFriendly()", () => {
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

describe("padNumberWithLeadingZeros()", () => {
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

describe("formatUrlQueryParams()", () => {
  let url;
  let queryParamMap;

  beforeEach(() => {
    url = "/beacons";
    queryParamMap = { useIndex: 0 };
  });

  it("should add a query param if none is specified", () => {
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0"
    );
  });

  it("should add an ampersand if a query param is already specified", () => {
    url += "?beaconIndex=0";
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?beaconIndex=0&useIndex=0"
    );
  });

  it("should correctly combine multiple query params", () => {
    queryParamMap = { useIndex: 0, beaconIndex: 0, hexId: "hello" };
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0&beaconIndex=0&hexId=hello"
    );
  });

  it("should not overwrite query params already in the url", () => {
    url += "?useIndex=0";
    queryParamMap = { useIndex: 0, beaconIndex: 0 };
    expect(formatUrlQueryParams(url, queryParamMap)).toBe(
      "/beacons?useIndex=0&beaconIndex=0"
    );
  });
});
