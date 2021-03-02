import { FieldInput } from "../../../src/lib/form/fieldInput";
import { FieldManager } from "../../../src/lib/form/fieldManager";

describe("FieldManager", () => {
  let value;
  let fieldInput: FieldInput;
  let fieldManager: FieldManager;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      hasErrorFn: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "hex id";
    fieldInput = new FieldInput(value);
    fieldManager = new FieldManager({ hexId: fieldInput });
  });

  it("should set the parent reference on the controls", () => {
    expect(fieldInput.parent).toBe(fieldManager);
  });

  it("should return the controls from the value `getter`", () => {
    expect(fieldManager.value).toStrictEqual({ hexId: fieldInput });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [validationRule(true)]),
      });

      expect(fieldManager.hasErrors()).toBe(false);
    });

    it("should have errors if the form has errors and is dirty ", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [validationRule(true)]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.hasErrors()).toBe(true);
    });

    it("should not have errors if the form does not have errors and is dirty ", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [validationRule(false)]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.hasErrors()).toBe(false);
    });
  });

  describe("errorSummary()", () => {
    it("should return the an empty array if the form is `pristine`", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [validationRule(true, "error!")]),
      });

      expect(fieldManager.errorSummary()).toStrictEqual([]);
    });

    it("should return the error summary for the hex id", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [validationRule(true, "error!")]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.errorSummary()).toStrictEqual([
        {
          fieldId: "hexId",
          errorMessages: ["error!"],
        },
      ]);
    });

    it("should return the error summary for the multiple control errors", () => {
      fieldManager = new FieldManager({
        hexId: new FieldInput(value, [
          validationRule(true, "error hex1"),
          validationRule(true, "error hex2"),
        ]),
        model: new FieldInput(value, [
          validationRule(true, "error model"),
          validationRule(false),
        ]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.errorSummary()).toStrictEqual([
        {
          fieldId: "hexId",
          errorMessages: ["error hex1", "error hex2"],
        },
        {
          fieldId: "model",
          errorMessages: ["error model"],
        },
      ]);
    });
  });
});
