import { AbstractControl } from "./abstractControl";
import { ValidationRule } from "./validators";

export class FormGroupControl extends AbstractControl {
  constructor(
    public readonly controls: { [key: string]: AbstractControl },
    validators: ValidationRule[] = []
  ) {
    super(controls, validators);
    this.setupFormControls();
  }

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
  public get value(): any {
    return this.controls;
  }

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

  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    return Object.keys(this.controls).some((key: string) => {
      const control: AbstractControl = this.controls[key];
      return control.hasErrors();
    });
  }

  private forEachControl(
    cb: (control: AbstractControl, key: string) => void
  ): void {
    Object.keys(this.controls).forEach((key: string) => {
      const control: AbstractControl = this.controls[key];
      return cb(control, key);
    });
  }
}
