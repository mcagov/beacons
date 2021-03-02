import { Callback } from "../utils";
import { AbstractFormNode } from "./abstractFormNode";
import { FieldInput } from "./fieldInput";
import { ValidationRule } from "./validators";

export type FormError = { fieldId: string; errorMessages: string[] };

/**
 * A class representing the parent for the the {@link FieldInput}.
 */
export class FieldManager extends AbstractFormNode {
  constructor(
    public readonly fields: Record<string, FieldInput>,
    validators: ValidationRule[] = []
  ) {
    super(fields, validators);
    this.setupFormControls();
  }

  /**
   * Sets all the child fields `parent` reference to this form group.
   */
  private setupFormControls(): void {
    this.forEachControl((control) => control.setParent(this));
  }

  /**
   * Sets this form manager and all descendant fields as dirty.
   * @override
   */
  public markAsDirty(): void {
    super.markAsDirty();
    this.forEachControl((control: FieldInput) => control.markAsDirty());
  }

  /**
   * Returns the fields that the form manager manages.
   */
  public get value(): Record<string, FieldInput> {
    return this.fields;
  }

  /**
   * Generates the error summary based on the fields it manages.
   */
  public errorSummary(): FormError[] {
    return Object.keys(this.fields)
      .filter((control) => this.fields[control].hasErrors())
      .map((fieldId) => {
        const fieldInput = this.fields[fieldId];
        return {
          fieldId,
          errorMessages: fieldInput.errorMessages(),
        };
      });
  }

  /**
   * Determines if any of the fields it manages have any errors.
   * @override
   */
  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    return Object.keys(this.fields).some((key: string) => {
      const field: FieldInput = this.fields[key];
      return field.hasErrors();
    });
  }

  /**
   * Convenience method for iterating over this field managers field inputs and calling the provided callback function.
   *
   * @param cb {Callback<FieldInput>}   The callback function
   */
  private forEachControl(cb: Callback<FieldInput>): void {
    Object.keys(this.fields).forEach((key: string) => {
      const field: FieldInput = this.fields[key];
      return cb(field);
    });
  }
}
