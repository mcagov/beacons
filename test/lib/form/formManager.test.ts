import { FieldManager } from "../../../src/lib/form/fieldManager";
import { FormManager } from "../../../src/lib/form/formManager";

describe("FormManager", () => {
  let value;
  let fieldManager: FieldManager;
  let formManager: FormManager;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      applies: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "hex id";
    fieldManager = new FieldManager(value);
    formManager = new FormManager({ hexId: fieldManager });
  });

  it("should set the parent reference on the controls", () => {
    expect(fieldManager.parent).toBe(formManager);
  });

  it("should return the controls from the value `getter`", () => {
    expect(formManager.value).toStrictEqual({ hexId: fieldManager });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true)]),
      });

      expect(formManager.hasErrors()).toBe(false);
    });

    it("should have errors if the form has errors and is dirty ", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true)]),
      });
      formManager.markAsDirty();

      expect(formManager.hasErrors()).toBe(true);
    });

    it("should not have errors if the form does not have errors and is dirty ", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(false)]),
      });
      formManager.markAsDirty();

      expect(formManager.hasErrors()).toBe(false);
    });
  });

  describe("errorSummary()", () => {
    it("should return the an empty array if the form is `pristine`", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, "error!")]),
      });

      expect(formManager.errorSummary()).toStrictEqual([]);
    });

    it("should return the error summary for the hex id", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, "error!")]),
      });
      formManager.markAsDirty();

      expect(formManager.errorSummary()).toStrictEqual([
        {
          fieldId: "hexId",
          errorMessages: ["error!"],
        },
      ]);
    });

    it("should return the error summary for the multiple control errors", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value, [
          validationRule(true, "error hex1"),
          validationRule(true, "error hex2"),
        ]),
        model: new FieldManager(value, [
          validationRule(true, "error model"),
          validationRule(false),
        ]),
      });
      formManager.markAsDirty();

      expect(formManager.errorSummary()).toStrictEqual([
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

  describe("serialise form", () => {
    it("should serialise a form with no fields", () => {
      formManager = new FormManager({});
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({ hasErrors: false, fields: {} });
    });

    it("should serialise a form with 1 field and no errors", () => {
      formManager = new FormManager({
        hexId: new FieldManager(value),
      });
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: false,
        fields: {
          hexId: {
            value,
            errorMessages: [],
          },
        },
      });
    });
  });
});
