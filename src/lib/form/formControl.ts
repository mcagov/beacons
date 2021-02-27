import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

export class FormControl extends AbstractControl {
  public readonly value: string;

  constructor(value: string, validators: ValidationRule[] = []) {
    super(value, validators);
    this.value = value ? value : "";
  }

  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    return this.validators.some((rule: ValidationRule) =>
      rule.hasErrorFn(this)
    );
  }
}
