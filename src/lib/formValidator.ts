import {
  fieldValidatorLookup,
  IFieldValidationResponse,
  IFieldValidator,
} from "./fieldValidators";

export interface IFormError {
  fieldId: string;
  errorMessages: string[];
}

export class FormValidator {
  public static validate(
    formData: Record<string, string>,
    validatorLookup: Record<string, IFieldValidator> = fieldValidatorLookup
  ): Record<string, IFieldValidationResponse> {
    const fields = Object.entries(formData);

    return fields.reduce((validatorResponse, [fieldId, value]) => {
      if (fieldId in validatorLookup) {
        validatorResponse[fieldId] = {
          ...validatorLookup[fieldId].validate(value),
        };
      }
      return validatorResponse;
    }, {});
  }

  public static errorSummary(
    formData: Record<string, string>,
    validatorLookup: Record<string, IFieldValidator> = fieldValidatorLookup
  ): IFormError[] {
    const validatedFields = Object.entries(
      this.validate(formData, validatorLookup)
    );

    return validatedFields
      .filter(([, field]) => field.invalid)
      .map(([id, field]) => {
        return { fieldId: id, errorMessages: field.errorMessages };
      });
  }

  public static hasErrors(
    formData: Record<string, string>,
    validatorLookup: Record<string, IFieldValidator> = fieldValidatorLookup
  ): boolean {
    return this.errorSummary(formData, validatorLookup).length > 0;
  }

  private FormValidator() {
    // Prevent external instantiation.
  }
}
