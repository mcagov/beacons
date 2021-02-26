import { Callback } from "../utils";
import { AbstractControl } from "./abstractControl";
import { FormControl } from "./formControl";
import { ValidationRule } from "./validators";

export class FormGroupControl extends AbstractControl {
  constructor(
    public readonly controls: { [key: string]: FormControl },
    validators: ValidationRule[] = []
  ) {
    super(controls, validators);
    this.setupFormControls();
  }

  private setupFormControls(): void {
    this.forEachControl((control) => control.setParent(this));
  }

  public markAsDirty(): void {
    this.pristine = false;
    this.forEachControl((control) => control.markAsDirty());
  }

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

    return Object.keys(this.controls).some((control) =>
      this.controls[control].hasErrors()
    );
  }

  private forEachControl(cb: Callback<FormControl>): void {
    Object.keys(this.controls).forEach((control) => cb(this.controls[control]));
  }
}
