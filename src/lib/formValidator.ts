import {
  IFieldValidator,
  IFieldValidationResponse,
  fieldValidatorLookup,
} from "./fieldValidators";

export interface IFormData {
  [key: string]: string;
}

export interface IFieldValidatorLookup {
  [key: string]: IFieldValidator;
}

export interface IFormValidationResponse {
  [key: string]: IFieldValidationResponse;
}

export interface IFormError {
  fieldId: string;
  errors: string[];
}

export class FormValidator {
  public static validate(
    formData: IFormData,
    validatorLookup: IFieldValidatorLookup = fieldValidatorLookup
  ): IFormValidationResponse {
    const fields = Object.entries(formData);

    return fields.reduce((validatorResponse, [fieldId, value]) => {
      validatorResponse[fieldId] = {
        ...validatorLookup[fieldId].validate(value),
      };

      return validatorResponse;
    }, {});
  }

  public static errorSummary(
    formData: IFormData,
    validatorLookup: IFieldValidatorLookup = fieldValidatorLookup
  ): IFormError[] {
    const validatedFields = Object.entries(
      this.validate(formData, validatorLookup)
    );

    return validatedFields
      .filter(([, field]) => !field.valid)
      .map(([id, field]) => {
        return { fieldId: id, errors: field.errors };
      });
  }

  public static hasErrors(
    formData: IFormData,
    validatorLookup: IFieldValidatorLookup = fieldValidatorLookup
  ): boolean {
    return this.errorSummary(formData, validatorLookup).length > 0;
  }

  private FormValidator() {
    // Prevent external instantiation.
  }
}
