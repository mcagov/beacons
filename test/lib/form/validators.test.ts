import { ValidatorFn, Validators } from "../../../src/lib/form/validators";

describe("Form Validators", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let applies: ValidatorFn;

  describe("required", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.required(expectedErrorMessage));
    });

    it("should have an error if the value is an empty string", () => {
      expect(applies("")).toBe(true);
    });

    it("should have an error if the value is null", () => {
      expect(applies(null)).toBe(true);
    });

    it("should have an error if the value is undefined", () => {
      expect(applies(undefined)).toBe(true);
    });

    it("should have an error if the value is just whitespace", () => {
      expect(applies(" ")).toBe(true);
    });

    it("should not have an error if the value is non-empty", () => {
      expect(applies("Hex ID!")).toBe(false);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("maxLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.maxLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should not have an error if the value is less than the max length", () => {
      expect(applies("")).toBe(false);
    });

    it("should not have an error if the value is equal to the max length", () => {
      expect(applies("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(applies("a".repeat(11))).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("isLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.isLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should not have an error if the value is empty, as empty values are covered by Validators.required", () => {
      expect(applies("")).toBe(false);
      expect(applies("   ")).toBe(false);
    });

    it("should have an error if the value is less than the required length", () => {
      expect(applies("a")).toBe(true);
    });

    it("should not have an error if the value is equal to the required length", () => {
      expect(applies("a".repeat(10))).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      expect(applies("a".repeat(11))).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("isValidDate", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.isValidDate(
        expectedErrorMessage
      ));
    });

    it("should have an error if the value is null", () => {
      expect(applies(null)).toBe(true);
    });

    it("should have an error if the not a date string", () => {
      expect(applies("beacon information")).toBe(true);
    });

    it("should not have an error if the value is a valid date string", () => {
      expect(applies(new Date().toISOString())).toBe(false);
    });
  });

  describe("isInThePast", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.isInThePast(
        expectedErrorMessage
      ));
    });

    it("should not have an error if the value is null", () => {
      expect(applies(null)).toBe(false);
    });

    it("should not have an error if the value is not a date string", () => {
      expect(applies("beacon information")).toBe(false);
    });

    it("should not have an error if the date is now", () => {
      expect(applies(new Date().toISOString())).toBe(false);
    });

    it("should not have an error if the date is in the past", () => {
      expect(applies(new Date().toISOString())).toBe(false);
    });

    it("should have an error if the date is in the future", () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      expect(applies(date.toISOString())).toBe(true);
    });
  });

  describe("minDateYear", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.minDateYear(
        expectedErrorMessage,
        2000
      ));
    });

    it("should not have an error if the value is null", () => {
      expect(applies(null)).toBe(false);
    });

    it("should not have an error if the value is not a date string", () => {
      expect(applies("beacon information")).toBe(false);
    });

    it("should not have an error if the date is greater than the minimum year", () => {
      expect(applies(new Date().toISOString())).toBe(false);
    });

    it("should have an error if the date is before the minimum year", () => {
      expect(applies(new Date(1999, 0, 0).toISOString())).toBe(true);
    });
  });

  describe("hexadecimalString", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.hexadecimalString(
        expectedErrorMessage
      ));
    });

    it("should not have an error if no value is provided", () => {
      expect(applies("")).toBe(false);
    });

    it("should not have an error if the letter is hexadecimal", () => {
      expect(applies("a")).toBe(false);
    });

    it("should have an error if the value does not contain hexadecimal characters", () => {
      expect(applies("AR2")).toBe(true);
    });

    it("should not have an error if the value only contains characters A-F", () => {
      expect(applies("ABCDEF")).toBe(false);
    });

    it("should not have an error if the value only contains characters a-f", () => {
      expect(applies("abcdef")).toBe(false);
    });

    it("should not have an error if the value only contains characters 0-9", () => {
      expect(applies("0123456789")).toBe(false);
    });

    it("should not have an error if the value only contains contains characters 0-9, A-F", () => {
      expect(applies("0123456789abcdED")).toBe(false);
    });
  });

  describe("ukEncodedBeacon", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.ukEncodedBeacon(
        expectedErrorMessage
      ));
    });

    it("should not have an error if no value is provided", () => {
      expect(applies("")).toBe(false);
      expect(applies(" ")).toBe(false);
    });

    it("should not error if the value does not look like a beacon hex Id", () => {
      expect(applies("not hexadecimal")).toBe(false);
      expect(applies("ABCDEF012")).toBe(false); // Hexadecimal but not 15 characters
    });

    it("should not have an error if a valid UK-encoded beacon is provided", () => {
      const validUkEncodedHexId = "1D0EA08C52FFBFF";
      expect(applies(validUkEncodedHexId)).toBe(false);
    });

    it("should error if a valid but not UK-encoded beacon is provided", () => {
      const validOtherCountryEncodedHexId = "C00F429578002C1";
      expect(applies(validOtherCountryEncodedHexId)).toBe(true);
    });
  });

  describe("wholeNumber", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.wholeNumber(
        expectedErrorMessage
      ));
    });

    it("should not have an error if no value is provided", () => {
      expect(applies("")).toBe(false);
    });

    it("should not have an error if the value is a number", () => {
      expect(applies("12")).toBe(false);
    });

    it("should have an error if the value is a number and characters", () => {
      expect(applies("12abc")).toBe(true);
    });
  });

  describe("phoneNumber", () => {
    beforeEach(() => {
      ({ errorMessage, applies } = Validators.phoneNumber(
        expectedErrorMessage
      ));
    });

    it("should error for obviously invalid phone numbers", () => {
      expect(applies("i am not a phone number")).toBe(true);
      expect(applies("0121 D0 0NE")).toBe(true);
      expect(applies("+44       ")).toBe(true);
    });

    it("should not error for UK mobile numbers", () => {
      expect(applies("07712 345678")).toBe(false);
      expect(applies("+447712 345678")).toBe(false);
    });

    it("should not error for valid satellite numbers", () => {
      expect(applies("+881612345678")).toBe(false);
      expect(applies("+870773166238")).toBe(false);
      expect(applies("+881677722191")).toBe(false);
      expect(applies("+8821663225558")).toBe(false);
    });

    it("should permit spaces", () => {
      expect(applies("077 12 345 678")).toBe(false);
      expect(applies("+44 77 12 345 67 8")).toBe(false);
      expect(applies("+8 8161 234 56 78")).toBe(false);
      expect(applies("+87 07731 66 238")).toBe(false);
      expect(applies("+88 167 772 21     91")).toBe(false);
      expect(applies("+ 882   1663225558")).toBe(false);
    });

    it("should permit dashes and hyphens", () => {
      expect(applies("07712-345-678")).toBe(false);
      expect(applies("+44-7712345-678")).toBe(false);
      expect(applies("+8816 - 12345678")).toBe(false);
    });

    it("should permit brackets", () => {
      expect(applies("(0)7712345678")).toBe(false);
      expect(applies("(+44) 7712345678")).toBe(false);
      expect(applies("(+8816)12345678")).toBe(false);
    });

    it("should permit '00' instead of '+' for country codes", () => {
      expect(applies("00447712345678")).toBe(false);
      expect(applies("008816-12345678")).toBe(false);
    });
  });

  xdescribe("email", () => {
    // TODO
  });
});
