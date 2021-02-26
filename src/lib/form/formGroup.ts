import { FieldRule } from "../fieldValidator";

export class FormGroupControl {
  private pristine: boolean = true;

  constructor(public controls: { [key: string]: FormControl }) {}

  public markAsDirty(): void {
    this.pristine = false;
  }

  public errorSummary(): string[] {
    return null;
  }

  public hasErrors(): boolean {
    return true;
  }
}

export class FormControl {
  private readonly _value: string;

  /**
   * Initialise the form control.
   *
   * @param value      {string}        The default value for the field
   * @param validators {FieldRule[]}   An array of validators for this form field
   */
  constructor(value: string, public readonly validators: FieldRule[] = []) {
    this._value = value ? value : "";
  }

  public get value(): string {
    return this._value;
  }

  public errorSummary(): string[] {
    return this.validators
      .filter((rule: FieldRule) => rule.hasErrorFn(this._value))
      .map((rule: FieldRule) => rule.errorMessage);
  }

  public hasErrors(): boolean {
    return this.validators.some((rule: FieldRule) =>
      rule.hasErrorFn(this._value)
    );
  }
}
