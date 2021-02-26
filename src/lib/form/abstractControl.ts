import { FormGroupControl } from "./formGroupControl";
import { ValidationRule } from "./validators";

export abstract class AbstractControl {
  protected _value: any;
  protected pristine = true;
  private _parent: FormGroupControl = null;

  constructor(value: any, public readonly validators: ValidationRule[]) {
    this._value = value;
  }

  setParent(parent: FormGroupControl): void {
    this._parent = parent;
  }

  public get parent(): FormGroupControl {
    return this._parent;
  }

  public abstract get value(): any;

  public markAsDirty(): void {
    this.pristine = false;
  }

  public abstract hasErrors(): boolean;
}
