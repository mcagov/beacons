/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldManager } from "./fieldManager";
import { ValidationRule } from "./validators";

type ControlValue = string | Record<string, AbstractFormNode>;

/**
 * This is the base class for `FieldInput`, and `FieldManager`.  It represents a node in the form tree.
 *
 * It provides shared behaviour, like running validators and calculating status.
 */
export abstract class AbstractFormNode {
  protected _value: any;

  /**
   * A control is `pristine` if the user has not edited the form.
   *
   * This is the case if the user has not submitted form data to the server to be validated.
   */
  protected pristine = true;

  private _parent: FieldManager = null;

  constructor(
    value: ControlValue,
    public readonly validators: ValidationRule[]
  ) {
    this._value = value;
  }

  /**
   * @param parent {FieldManager}   Sets the parent form group control
   */
  setParent(parent: FieldManager): void {
    this._parent = parent;
  }

  /**
   * Getter for the parent control.
   */
  public get parent(): FieldManager {
    return this._parent;
  }

  /**
   * Marks the control as `dirty`.
   */
  public markAsDirty(): void {
    this.pristine = false;
  }

  /**
   * Validates this control against the validation rules.
   *
   * @returns {string[]}   The array of error messages
   */
  public errorMessages(): string[] {
    const validators = this.pristine ? [] : this.validators;

    return validators
      .filter((rule: ValidationRule) => rule.applies(this))
      .map((rule: ValidationRule) => rule.errorMessage);
  }

  public abstract get value(): any;

  /**
   * Determines if the control has any errors.
   */
  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    return this.validators.some((rule: ValidationRule) => rule.applies(this));
  }
}
