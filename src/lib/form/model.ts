import { Callback } from "../utils";
import { FieldRule } from "./validators";

export class FormGroupControl {
  private pristine: boolean = true;

  constructor(public controls: { [key: string]: FormControl }) {}

  public markAsDirty(): void {
    this.pristine = false;
    this.forEach((control) => control.markAsDirty());
  }

  public errorSummary(): string[] {
    return null;
  }

  public hasErrors(): boolean {
    return true;
  }

  private forEach(cb: Callback<FormControl>): void {
    Object.keys(this.controls).forEach((control) => cb(this.controls[control]));
  }
}

export class FormControl {
  private readonly _value: string;

  private pristine: boolean = true;

  /**
   * Initialise the form control.
   *
   * @param value      {string}        The default value for the field
   * @param validators {FieldRule[]}   An array of validators for this form field
   */
  constructor(value: string, public readonly validators: FieldRule[] = []) {
    this._value = value ? value : "";
  }

  /**
   * Public getter for the form control value.
   *
   * @requires {string}  The value within the form control
   */
  public get value(): string {
    return this._value;
  }

  public markAsDirty(): void {
    this.pristine = false;
  }

  public errorMessages(): string[] {
    const validators = this.pristine ? [] : this.validators;
    return validators
      .filter((rule: FieldRule) => rule.hasErrorFn(this._value))
      .map((rule: FieldRule) => rule.errorMessage);
  }

  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    return this.validators.some((rule: FieldRule) =>
      rule.hasErrorFn(this._value)
    );
  }
}
