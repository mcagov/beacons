import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

export class FormControl extends AbstractControl {
  public readonly value: string;

  constructor(value: any, validators: ValidationRule[] = []) {
    super(value, validators);
    this.value = value ? value : "";
  }

  public markAsDirty(): void {
    this.pristine = false;
  }

  public errorMessages(): string[] {
    const validators = this.pristine ? [] : this.validators;
    return validators
      .filter((rule: ValidationRule) => rule.hasErrorFn(this))
      .map((rule: ValidationRule) => rule.errorMessage);
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
