import { FieldManager } from "../../../src/lib/form/FieldManager";
import { FormManager } from "../../../src/lib/form/FormManager";

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

  describe("serialise form", () => {
    it("should serialise a form with no fields", () => {
      formManager = new FormManager({});
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: false,
        fields: {},
        errorSummary: [],
      });
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
        errorSummary: [],
      });
    });

    it("should serialise a form with 1 field with errors", () => {
      const errorMessage = "Hex ID is required";
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, errorMessage)]),
      });
      formManager.markAsDirty();
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: true,
        fields: {
          hexId: {
            value,
            errorMessages: [errorMessage],
          },
        },
        errorSummary: [{ fieldId: "hexId", errorMessages: [errorMessage] }],
      });
    });

    it("should serialise a form with multiple errors", () => {
      const errorMessage = "Hex ID is required";
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, errorMessage)]),
        model: new FieldManager("Beacon model", [
          validationRule(true, errorMessage),
        ]),
      });
      formManager.markAsDirty();
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: true,
        fields: {
          hexId: {
            value,
            errorMessages: [errorMessage],
          },
          model: {
            value: "Beacon model",
            errorMessages: [errorMessage],
          },
        },
        errorSummary: [
          { fieldId: "hexId", errorMessages: [errorMessage] },
          { fieldId: "model", errorMessages: [errorMessage] },
        ],
      });
    });

    it("should serialise a form with some errors", () => {
      const errorMessage = "Hex ID is required";
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(true, errorMessage)]),
        model: new FieldManager("Beacon model", [
          validationRule(false, errorMessage),
        ]),
      });
      formManager.markAsDirty();
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: true,
        fields: {
          hexId: {
            value,
            errorMessages: [errorMessage],
          },
          model: {
            value: "Beacon model",
            errorMessages: [],
          },
        },
        errorSummary: [{ fieldId: "hexId", errorMessages: [errorMessage] }],
      });
    });

    it("should serialise a form without errors if conditional validation rules not met", () => {
      const errorMessage = "Hex ID is required";
      formManager = new FormManager({
        hexId: new FieldManager(value, [validationRule(false, errorMessage)]),
        model: new FieldManager(
          "Beacon model",
          [validationRule(true, errorMessage)],
          [
            {
              dependsOn: "hexId",
              meetingCondition: () => false,
            },
          ]
        ),
      });
      formManager.markAsDirty();
      const formJson = formManager.serialise();

      expect(formJson).toStrictEqual({
        hasErrors: false,
        fields: {
          hexId: {
            value,
            errorMessages: [],
          },
          model: {
            value: "Beacon model",
            errorMessages: [],
          },
        },
        errorSummary: [],
      });
    });
  });
});
