import { Callback } from "../utils";
import { AbstractFormNode } from "./AbstractFormNode";
import { FieldJSON, FieldManager } from "./FieldManager";

export type FormError = { fieldId: string; errorMessages: string[] };

export type FormJSON = {
  hasErrors: boolean;
  fields: Record<string, FieldJSON>;
  errorSummary: FormError[];
};

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
   * Sets this form manager and all descendant fields as dirty.
   * @override
   */
  public asDirty(): FormManager {
    super.markAsDirty();
    this.forEachControl((control: FieldManager) => control.markAsDirty());
    return this;
  }

  /**
   * Returns the fields that the form manager manages.
   */
  public get value(): Record<string, FieldManager> {
    return this.fields;
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

  public isValid(): boolean {
    return !this.hasErrors();
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

  public serialise(): FormJSON {
    const hasErrors = this.hasErrors();
    const fields = this.serialiseFields();
    const errorSummary = this.errorSummary();

    return { hasErrors, fields, errorSummary };
  }

  private serialiseFields(): Record<string, FieldJSON> {
    return Object.keys(this.fields).reduce((serialisedFields, currentField) => {
      const fieldManager: FieldManager = this.fields[currentField];

      serialisedFields[currentField] = fieldManager.serialise();

      return serialisedFields;
    }, {});
  }

  /**
   * Generates the error summary based on the fields it manages.
   */
  private errorSummary(): FormError[] {
    return Object.keys(this.fields)
      .filter((control) => this.fields[control].hasErrors())
      .map((fieldId) => {
        const fieldInput = this.fields[fieldId];
        return {
          fieldId: fieldInput.fieldId || fieldId,
          errorMessages: fieldInput.errorMessages(),
        };
      });
  }
}
