import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

/**
 * Represents a leaf node in the AST of form controls.
 *
 * This class is responsible for managing the value of a form input and can run validation rules, and calculate status of the form control.
 */
export class FormControl extends AbstractControl {
  constructor(value: string, validators: ValidationRule[] = []) {
    value = value ? value : "";
    super(value, validators);
  }

  /**
   * Public getter for the value this form control manages.
   * @override
   */
  public get value(): string {
    return this._value as string;
  }
}
