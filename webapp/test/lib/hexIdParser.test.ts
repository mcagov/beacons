import { HexIdParser } from "../../src/lib/hexIdParser/HexIdParser";

describe("HexIdParser", () => {
  describe("countryCode", () => {
    const expectations = [
      { hexId: "DABFE0F83E0F83C", countryCode: 725 },
      { hexId: "ADCD0228C500401", countryCode: 366 },
      { hexId: "ADC268F8E0D3730", countryCode: 366 },
      { hexId: "ADC268F8E0D3780", countryCode: 366 },
      { hexId: "ADCD0228C500401", countryCode: 366 },
      { hexId: "C00F429578002C1", countryCode: 512 },
      { hexId: "C00F429578002C187654321", countryCode: 512 },
      { hexId: "1D0EA08C52FFBFF", countryCode: 232 }, // UK-encoded
      { hexId: "1D0EA08C52FFBFF12345678", countryCode: 232 }, // UK-encoded
    ];

    expectations.forEach((expectation) => {
      it(`should parse ${expectation.countryCode} as the registration country code from ${expectation.hexId}`, () => {
        const countryCode = HexIdParser.countryCode(expectation.hexId);

        expect(countryCode).toBe(expectation.countryCode);
      });
    });
  });

  describe("countryName", () => {
    const expectations = [
      { hexId: "DABFE0F83E0F83C", countryName: "Chile" },
      { hexId: "ADCD0228C500401", countryName: "United States of America" },
      {
        hexId: "1D0EA08C52FFBFF",
        countryName: "United Kingdom",
      },
      { hexId: "Unknown Hex Id", countryName: "an unknown country" },
    ];

    expectations.forEach((expectation) => {
      it(`should parse ${expectation.countryName} as the registration country code from ${expectation.hexId}`, () => {
        const countryName = HexIdParser.countryName(expectation.hexId);

        expect(countryName).toBe(expectation.countryName);
      });
    });
  });
});
