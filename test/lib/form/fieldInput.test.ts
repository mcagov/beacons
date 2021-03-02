import { FieldInput } from "../../../src/lib/form/fieldInput";

describe("FieldInput", () => {
  let value;
  let fieldInput: FieldInput;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      applies: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "Hex ID is 0-9 and A-F characters";
  });

  it("should return the value managed by the form control", () => {
    fieldInput = new FieldInput(value);
    expect(fieldInput.value).toBe(value);
  });

  it("should set the value to an empty string if the value passed in is null", () => {
    fieldInput = new FieldInput(null);
    expect(fieldInput.value).toBe("");
  });

  it("should set the value to an empty string if the value passed in is undefined", () => {
    fieldInput = new FieldInput(undefined);
    expect(fieldInput.value).toBe("");
  });

  it("should return null for the parent reference", () => {
    fieldInput = new FieldInput(value);
    expect(fieldInput.parent).toBeNull();
  });

  describe("errorMessages()", () => {
    it("should return an empty arrray if the form is `pristine`", () => {
      fieldInput = new FieldInput(value, [validationRule(true)]);
      expect(fieldInput.errorMessages()).toStrictEqual([]);
    });

    it("should return the error message from the rule if violated and the form is dirty", () => {
      fieldInput = new FieldInput(value, [validationRule(true, "hexID error")]);
      fieldInput.markAsDirty();
      expect(fieldInput.errorMessages()).toStrictEqual(["hexID error"]);
    });

    it("should return an empty array if no rules violated and the form is dirty", () => {
      fieldInput = new FieldInput(value, [
        validationRule(false, "hexID error"),
      ]);
      fieldInput.markAsDirty();
      expect(fieldInput.errorMessages()).toStrictEqual([]);
    });

    it("should return all error messages that are violated if the form is dirty", () => {
      fieldInput = new FieldInput(value, [
        validationRule(true, "hexID error"),
        validationRule(false, "another hexID error"),
        validationRule(true, "hex error"),
      ]);
      fieldInput.markAsDirty();
      expect(fieldInput.errorMessages()).toStrictEqual([
        "hexID error",
        "hex error",
      ]);
    });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      fieldInput = new FieldInput(value, [validationRule(true)]);
      expect(fieldInput.hasErrors()).toBe(false);
    });

    it("should return an error if the form has validation errors and is dirty", () => {
      fieldInput = new FieldInput(value, [validationRule(true)]);
      fieldInput.markAsDirty();
      expect(fieldInput.hasErrors()).toBe(true);
    });

    it("should not have any errors if no rules are violated and the form is dirty", () => {
      fieldInput = new FieldInput(value, [validationRule(false)]);
      fieldInput.markAsDirty();
      expect(fieldInput.hasErrors()).toBe(false);
    });

    it("should return an error any of the rules are violated and the form is dirty", () => {
      fieldInput = new FieldInput(value, [
        validationRule(true),
        validationRule(false),
      ]);
      fieldInput.markAsDirty();
      expect(fieldInput.hasErrors()).toBe(true);
    });
  });
});
