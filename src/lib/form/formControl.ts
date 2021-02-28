import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

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
