import { Callback } from "../utils";
import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

export class FormGroupControl extends AbstractControl {
  constructor(
    public readonly controls: Record<string, AbstractControl>,
    validators: ValidationRule[] = []
  ) {
    super(controls, validators);
    this.setupFormControls();
  }

  /**
   * Sets all the child controls `parent` reference to this form group.
   */
  private setupFormControls(): void {
    this.forEachControl((control) => control.setParent(this));
  }

  /**
   * Sets this form group and all descendant controls as dirty.
   * @override
   */
  public markAsDirty(): void {
    super.markAsDirty();
    this.forEachControl((control: AbstractControl) => control.markAsDirty());
  }

  /**
   * Returns the group of controls that the form group manages.
   */
  public get value(): Record<string, AbstractControl> {
    return this.controls;
  }

  /**
   * Generates the error summary based on this form groups controls.
   */
  public errorSummary(): { field: string; errorMessages: string[] }[] {
    return Object.keys(this.controls)
      .filter((control) => this.controls[control].hasErrors())
      .map((field) => {
        const formControl = this.controls[field];
        return {
          field,
          errorMessages: formControl.errorMessages(),
        };
      });
  }

  /**
   * Determines if this form group has any errors or any of it's child controls.
   * @override
   */
  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    const formGroupHasErrors: boolean = super.hasErrors();
    const controlsHasErrors: boolean = Object.keys(this.controls).some(
      (key: string) => {
        const control: AbstractControl = this.controls[key];
        return control.hasErrors();
      }
    );

    return formGroupHasErrors || controlsHasErrors;
  }

  /**
   * Convenience method for iterating over this form groups controls and calling the provided callback function.
   *
   * @param cb {Callback<AbstractControl>}   The callback function
   */
  private forEachControl(cb: Callback<AbstractControl>): void {
    Object.keys(this.controls).forEach((key: string) => {
      const control: AbstractControl = this.controls[key];
      return cb(control);
    });
  }
}
