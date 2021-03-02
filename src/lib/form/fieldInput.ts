import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

/**
 * This class is responsible for managing the value of a form input and can run validation rules, and calculate status of the field input.
 */
export class FieldInput extends AbstractControl {
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
