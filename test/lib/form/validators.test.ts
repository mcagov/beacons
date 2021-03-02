import { AbstractFormNode } from "../../../src/lib/form/abstractControl";
import { FieldManager } from "../../../src/lib/form/fieldManager";
import { ValidatorFn, Validators } from "../../../src/lib/form/validators";

describe("Form Validators", () => {
  const expectedErrorMessage = "Hex ID is a validated field";
  let errorMessage: string;
  let hasErrorFn: ValidatorFn;

  class FieldInput extends AbstractFormNode {
    constructor(value: string) {
      super(value, []);
    }
    public get value() {
      return this._value;
    }
    public hasErrors(): boolean {
      return false;
    }
  }

  const fieldWithValue = (value) => new FieldInput(value);

  describe("required", () => {
    beforeEach(() => {
      ({ errorMessage, applies: hasErrorFn } = Validators.required(
        expectedErrorMessage
      ));
    });

    it("should have an error if the value is an empty string", () => {
      const field = fieldWithValue("");
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should have an error if the value is null", () => {
      const field = fieldWithValue(null);
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should have an error if the value is undefined", () => {
      const field = fieldWithValue(undefined);
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should not have an error if the value is non-empty", () => {
      const field = fieldWithValue("Hex ID!");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("maxLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies: hasErrorFn } = Validators.maxLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should not have an error if the value is less than the max length", () => {
      const field = fieldWithValue("");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should not have an error if the value is equal to the max length", () => {
      const field = fieldWithValue("a".repeat(10));
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      const field = fieldWithValue("a".repeat(11));
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("isLength", () => {
    beforeEach(() => {
      ({ errorMessage, applies: hasErrorFn } = Validators.isLength(
        expectedErrorMessage,
        10
      ));
    });

    it("should have an error if the value is less than the required length", () => {
      const field = fieldWithValue("a");
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should not have an error if the value is equal to the required length", () => {
      const field = fieldWithValue("a".repeat(10));
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should have an error if the value is greater than the max length", () => {
      const field = fieldWithValue("a".repeat(11));
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should return the expected error message", () => {
      expect(expectedErrorMessage).toBe(errorMessage);
    });
  });

  describe("hexId", () => {
    beforeEach(() => {
      ({ errorMessage, applies: hasErrorFn } = Validators.hexId(
        expectedErrorMessage
      ));
    });

    it("should have an error if no value is provided", () => {
      const field = fieldWithValue("a");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should return true if the value does not contain hexadecimal characters", () => {
      const field = fieldWithValue("AR2");
      expect(hasErrorFn(field)).toBe(true);
    });

    it("should not have an error if the value only contains characters A-F", () => {
      const field = fieldWithValue("ABCDEF");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should not have an error if the value only contains characters a-f", () => {
      const field = fieldWithValue("abcdef");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should not have an error if the value only contains characters 0-9", () => {
      const field = fieldWithValue("0123456789");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should not have an error if the value only contains contains characters 0-9, A-F", () => {
      const field = fieldWithValue("0123456789abcdED");
      expect(hasErrorFn(field)).toBe(false);
    });
  });

  describe("wholeNumber", () => {
    beforeEach(() => {
      ({ errorMessage, applies: hasErrorFn } = Validators.wholeNumber(
        expectedErrorMessage
      ));
    });

    it("should not have an error if no value is provided", () => {
      const field = fieldWithValue("");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should not have an error if the value is a number", () => {
      const field = fieldWithValue("12");
      expect(hasErrorFn(field)).toBe(false);
    });

    it("should have an error if the value is a number and characters", () => {
      const field = fieldWithValue("12abc");
      expect(hasErrorFn(field)).toBe(true);
    });
  });

  describe("conditionalOnValue", () => {
    let field1;
    let field1Value;
    let field2;
    let field2Value;

    beforeEach(() => {
      field1Value = "hex id";
      field1 = new FieldInput(field1Value);

      field2 = new FieldInput(field2Value);
      field2Value = "beacon model";

      new FieldManager({
        key1: field1,
        key2: field2,
      });
    });

    it("should not have an error if the siblings field does not meet the criteria", () => {
      ({ applies: hasErrorFn } = Validators.conditionalOnValue(
        errorMessage,
        "key1",
        "some other value",
        () => true
      ));
      expect(hasErrorFn(field1)).toBe(false);
    });

    it("should not have an error if the siblings field meets the criteria but the validation rule does not error", () => {
      ({ applies: hasErrorFn } = Validators.conditionalOnValue(
        errorMessage,
        "key1",
        field1Value,
        () => false
      ));
      expect(hasErrorFn(field1)).toBe(false);
    });

    it("should have an error if the siblings field meets the criteria and the validation rule applies", () => {
      ({ applies: hasErrorFn } = Validators.conditionalOnValue(
        errorMessage,
        "key1",
        field1Value,
        () => true
      ));
      expect(hasErrorFn(field1)).toBe(true);
    });
  });

  xdescribe("email", () => {
    // TODO
  });
});
