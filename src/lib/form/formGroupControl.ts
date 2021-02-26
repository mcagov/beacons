import { Callback } from "../utils";
import { FormControl } from "./formControl";

export class FormGroupControl {
  private pristine = true;

  constructor(public controls: { [key: string]: FormControl }) {}

  public markAsDirty(): void {
    this.pristine = false;
    this.forEach((control) => control.markAsDirty());
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

  private forEach(cb: Callback<FormControl>): void {
    Object.keys(this.controls).forEach((control) => cb(this.controls[control]));
  }
}
