import { isoDateString } from "../../src/lib/dateTimeUtils";

describe("dateTimeUtils", () => {
  describe("isoDateString()", () => {
    it("formats timestamps as YYYY-MM-DD", () => {
      expect(isoDateString("2021", "12")).toBe("2021-12-01");
      expect(isoDateString("2021", "1")).toBe("2021-01-01");
    });

    it("returns null for invalid inputs", () => {
      expect(isoDateString("", "1")).toBe(null);
      expect(isoDateString("2001", "13")).toBe(null);
    });
  });
});
