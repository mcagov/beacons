import { HexIdParser } from "../../src/lib/hexIdParser";

describe("HexIdParser", () => {
  it("should parse the registration country from a 15-digit hexId", () => {
    const hexId = "DABFE0F83E0F83C";
    const expectedCountryCode = 725;
    const expectedCountryName = "Chile";

    const countryCode = HexIdParser.countryCode(hexId);
    const countryName = HexIdParser.countryName(hexId);

    expect(countryCode).toBe(expectedCountryCode);
    expect(countryName).toEqual(expectedCountryName);
  });
});
