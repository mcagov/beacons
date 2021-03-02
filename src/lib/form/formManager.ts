import { Callback } from "../utils";
import { AbstractFormNode } from "./abstractFormNode";
import { FieldManager } from "./fieldManager";

export type FormError = { fieldId: string; errorMessages: string[] };

/**
 * A class representing the parent for the the {@link FieldManager}.
 */
export class FormManager extends AbstractFormNode {
  constructor(public readonly fields: Record<string, FieldManager>) {
    super(fields);
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
    this.forEachControl((control: FieldManager) => control.markAsDirty());
  }

  /**
   * Returns the fields that the form manager manages.
   */
  public get value(): Record<string, FieldManager> {
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
      const field: FieldManager = this.fields[key];
      return field.hasErrors();
    });
  }

  /**
   * Convenience method for iterating over this field managers field inputs and calling the provided callback function.
   *
   * @param cb {Callback<FieldManager>}   The callback function
   */
  private forEachControl(cb: Callback<FieldManager>): void {
    Object.keys(this.fields).forEach((key: string) => {
      const field: FieldManager = this.fields[key];
      return cb(field);
    });
  }
}
