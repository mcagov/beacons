import { FieldManager } from "../../../src/lib/form/fieldManager";
import { FormManager } from "../../../src/lib/form/formManager";

describe("FieldManager", () => {
  let value;
  let fieldManager: FieldManager;

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
    fieldManager = new FieldManager(value);
    expect(fieldManager.value).toBe(value);
  });

  it("should set the value to an empty string if the value passed in is null", () => {
    fieldManager = new FieldManager(null);
    expect(fieldManager.value).toBe("");
  });

  it("should set the value to an empty string if the value passed in is undefined", () => {
    fieldManager = new FieldManager(undefined);
    expect(fieldManager.value).toBe("");
  });

  it("should return null for the parent reference", () => {
    fieldManager = new FieldManager(value);
    expect(fieldManager.parent).toBeNull();
  });

  describe("errorMessages()", () => {
    it("should return an empty arrray if the form is `pristine`", () => {
      fieldManager = new FieldManager(value, [validationRule(true)]);
      expect(fieldManager.errorMessages()).toStrictEqual([]);
    });

    it("should return the error message from the rule if violated and the form is dirty", () => {
      fieldManager = new FieldManager(value, [
        validationRule(true, "hexID error"),
      ]);
      fieldManager.markAsDirty();
      expect(fieldManager.errorMessages()).toStrictEqual(["hexID error"]);
    });

    it("should return an empty array if no rules violated and the form is dirty", () => {
      fieldManager = new FieldManager(value, [
        validationRule(false, "hexID error"),
      ]);
      fieldManager.markAsDirty();
      expect(fieldManager.errorMessages()).toStrictEqual([]);
    });

    it("should return all error messages that are violated if the form is dirty", () => {
      fieldManager = new FieldManager(value, [
        validationRule(true, "hexID error"),
        validationRule(false, "another hexID error"),
        validationRule(true, "hex error"),
      ]);
      fieldManager.markAsDirty();
      expect(fieldManager.errorMessages()).toStrictEqual([
        "hexID error",
        "hex error",
      ]);
    });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      fieldManager = new FieldManager(value, [validationRule(true)]);
      expect(fieldManager.hasErrors()).toBe(false);
    });

    it("should return an error if the form has validation errors and is dirty", () => {
      fieldManager = new FieldManager(value, [validationRule(true)]);
      fieldManager.markAsDirty();
      expect(fieldManager.hasErrors()).toBe(true);
    });

    it("should not have any errors if no rules are violated and the form is dirty", () => {
      fieldManager = new FieldManager(value, [validationRule(false)]);
      fieldManager.markAsDirty();
      expect(fieldManager.hasErrors()).toBe(false);
    });

    it("should return an error any of the rules are violated and the form is dirty", () => {
      fieldManager = new FieldManager(value, [
        validationRule(true),
        validationRule(false),
      ]);
      fieldManager.markAsDirty();
      expect(fieldManager.hasErrors()).toBe(true);
    });
  });

  describe("conditional validation", () => {
    it("should not have errors because the dependent condition is not met", () => {
      const conditions = [
        {
          dependsOn: "radioButton",
          meetingCondition: (value) => value === "OTHER",
        },
      ];
      const formManager = new FormManager({
        radioButton: new FieldManager(
          "A value that doesn't meet the OtherTextInput's condition"
        ),
        OtherTextInput: new FieldManager(
          "",
          [validationRule(true)],
          conditions
        ),
      });
      formManager.markAsDirty();

      const hasErrors = formManager.hasErrors();

      expect(hasErrors).toBe(false);
    });

    it("should error because the dependent condition is met", () => {
      const conditions = [
        {
          dependsOn: "radioButton",
          meetingCondition: (value) => value === "OTHER",
        },
      ];
      const formManager = new FormManager({
        radioButton: new FieldManager("OTHER"),
        OtherTextInput: new FieldManager(
          "",
          [validationRule(true)],
          conditions
        ),
      });
      formManager.markAsDirty();

      const hasErrors = formManager.hasErrors();

      expect(hasErrors).toBe(true);
    });

    it("should give a suitable error message if dependent field is not found", () => {
      const conditions = [
        {
          dependsOn: "nonexistentField",
          meetingCondition: () => true,
        },
      ];
      const formManager = new FormManager({
        radioButton: new FieldManager("OTHER"),
        otherTextInput: new FieldManager(
          "",
          [validationRule(true)],
          conditions
        ),
      });
      formManager.markAsDirty();

      const action = () => formManager.hasErrors();

      expect(action).toThrow(ReferenceError);
    });
  });

  describe("serialise form field", () => {
    it("should serialise an input that has errors", () => {});
  });
});
