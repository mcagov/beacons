import { toIsoDateString } from "../../src/lib/toIsoDateString";

describe("dateTimeUtils", () => {
  describe("toIsoDateString()", () => {
    it("formats timestamps as YYYY-MM-DD", () => {
      expect(toIsoDateString("2021", "12")).toBe("2021-12-01");
      expect(toIsoDateString("2021", "1")).toBe("2021-01-01");
    });

    it("returns null for invalid inputs", () => {
      expect(toIsoDateString("", "1")).toBe(null);
      expect(toIsoDateString("2001", "13")).toBe(null);
    });
  });
});
