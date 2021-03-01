import { FormControl } from "../../../src/lib/form/formControl";
import { FormGroupControl } from "../../../src/lib/form/formGroupControl";

describe("FormGroupControl", () => {
  let value;
  let formControl: FormControl;
  let formGroupControl: FormGroupControl;

  const validationRule = (shouldError: boolean, errorMessage = "") => {
    return {
      errorMessage,
      hasErrorFn: () => shouldError,
    };
  };

  beforeEach(() => {
    value = "hex id";
    formControl = new FormControl(value);
    formGroupControl = new FormGroupControl({ hexId: formControl });
  });

  it("should set the parent reference on the controls", () => {
    expect(formControl.parent).toBe(formGroupControl);
  });

  it("should return the controls from the value `getter`", () => {
    expect(formGroupControl.value).toStrictEqual({ hexId: formControl });
  });

  describe("hasErrors()", () => {
    it("should not have errors if the form is `pristine`", () => {
      formGroupControl = new FormGroupControl({
        hexId: new FormControl(value, [validationRule(true)]),
      });

      expect(formGroupControl.hasErrors()).toBe(false);
    });

    it("should have errors if the form has errors and is dirty ", () => {
      formGroupControl = new FormGroupControl({
        hexId: new FormControl(value, [validationRule(true)]),
      });
      formGroupControl.markAsDirty();

      expect(formGroupControl.hasErrors()).toBe(true);
    });

    it("should not have errors if the form does not have errors and is dirty ", () => {
      formGroupControl = new FormGroupControl({
        hexId: new FormControl(value, [validationRule(false)]),
      });
      formGroupControl.markAsDirty();

      expect(formGroupControl.hasErrors()).toBe(false);
    });

    it("should not have errors if the conrtols do not have any errors but the form group does ", () => {
      formGroupControl = new FormGroupControl(
        {
          hexId: new FormControl(value, [validationRule(false)]),
        },
        [validationRule(true)]
      );
      formGroupControl.markAsDirty();

      expect(formGroupControl.hasErrors()).toBe(true);
    });
  });
});
