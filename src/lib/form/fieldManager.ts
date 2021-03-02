import { Callback } from "../utils";
import { AbstractFormNode } from "./abstractControl";
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
    this.forEachControl((control: AbstractFormNode) => control.markAsDirty());
  }

  /**
   * Returns the group of controls that the form group manages.
   */
  public get value(): Record<string, AbstractFormNode> {
    return this.fields;
  }

  /**
   * Generates the error summary based on the fields it manager.
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
      const control: AbstractFormNode = this.fields[key];
      return control.hasErrors();
    });
  }

  /**
   * Convenience method for iterating over this field managers field inputs and calling the provided callback function.
   *
   * @param cb {Callback<AbstractFormNode>}   The callback function
   */
  private forEachControl(cb: Callback<AbstractFormNode>): void {
    Object.keys(this.fields).forEach((key: string) => {
      const control: AbstractFormNode = this.fields[key];
      return cb(control);
    });
  }
}
