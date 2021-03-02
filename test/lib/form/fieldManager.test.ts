import { FieldManager } from "../../../src/lib/form/fieldManager";
import { FormManager } from "../../../src/lib/form/formManager";

describe("FieldManager", () => {
  let value;
  let fieldInput: FieldManager;
  let fieldManager: FormManager;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      applies: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "hex id";
    fieldInput = new FieldManager(value);
    fieldManager = new FormManager({ hexId: fieldInput });
  });

  it("should set the parent reference on the controls", () => {
    expect(fieldInput.parent).toBe(fieldManager);
  });

  it("should return the controls from the value `getter`", () => {
    expect(fieldManager.value).toStrictEqual({ hexId: fieldInput });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true)]),
      });

      expect(fieldManager.hasErrors()).toBe(false);
    });

    it("should have errors if the form has errors and is dirty ", () => {
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true)]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.hasErrors()).toBe(true);
    });

    it("should not have errors if the form does not have errors and is dirty ", () => {
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(false)]),
      });
      fieldManager.markAsDirty();

      expect(fieldManager.hasErrors()).toBe(false);
    });
  });

  describe("errorSummary()", () => {
    it("should return the an empty array if the form is `pristine`", () => {
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, "error!")]),
      });

      expect(fieldManager.errorSummary()).toStrictEqual([]);
    });

    it("should return the error summary for the hex id", () => {
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, "error!")]),
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
      fieldManager = new FormManager({
        hexId: new FieldManager(value, [
          validationRule(true, "error hex1"),
          validationRule(true, "error hex2"),
        ]),
        model: new FieldManager(value, [
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
