import { FormControl } from "../../../src/lib/form/formControl";

describe("FormControl", () => {
  let value;
  let formControl: FormControl;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      hasErrorFn: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "Hex ID is 0-9 and A-F characters";
  });

  it("should return the value managed by the form control", () => {
    formControl = new FormControl(value);
    expect(formControl.value).toBe(value);
  });

  it("should return null for the parent reference", () => {
    formControl = new FormControl(value);
    expect(formControl.parent).toBeNull();
  });

  describe("errorMessages()", () => {
    it("should return an empty arrray if the form is `pristine`", () => {
      formControl = new FormControl(value, [validationRule(true)]);
      expect(formControl.errorMessages()).toStrictEqual([]);
    });

    it("should return the error message from the rule if violated and the form is dirty", () => {
      formControl = new FormControl(value, [
        validationRule(true, "hexID error"),
      ]);
      formControl.markAsDirty();
      expect(formControl.errorMessages()).toStrictEqual(["hexID error"]);
    });

    it("should return an empty array if no rules violated and the form is dirty", () => {
      formControl = new FormControl(value, [
        validationRule(false, "hexID error"),
      ]);
      formControl.markAsDirty();
      expect(formControl.errorMessages()).toStrictEqual([]);
    });

    it("should return all error messages that are violated if the form is dirty", () => {
      formControl = new FormControl(value, [
        validationRule(true, "hexID error"),
        validationRule(false, "another hexID error"),
        validationRule(true, "hex error"),
      ]);
      formControl.markAsDirty();
      expect(formControl.errorMessages()).toStrictEqual([
        "hexID error",
        "hex error",
      ]);
    });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      formControl = new FormControl(value, [validationRule(true)]);
      expect(formControl.hasErrors()).toBe(false);
    });

    it("should return an error if the form has validation errors and is dirty", () => {
      formControl = new FormControl(value, [validationRule(true)]);
      formControl.markAsDirty();
      expect(formControl.hasErrors()).toBe(true);
    });

    it("should not have any errors if no rules are violated and the form is dirty", () => {
      formControl = new FormControl(value, [validationRule(false)]);
      formControl.markAsDirty();
      expect(formControl.hasErrors()).toBe(false);
    });

    it("should return an error any of the rules are violated and the form is dirty", () => {
      formControl = new FormControl(value, [
        validationRule(true),
        validationRule(false),
      ]);
      formControl.markAsDirty();
      expect(formControl.hasErrors()).toBe(true);
    });
  });
});
