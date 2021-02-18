import { IFieldValidator, IFieldValidationResponse } from "./fieldValidators";

export interface IFormData {
  [key: string]: string;
}

export interface IFieldValidatorDictionary {
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
  validate(
    fieldValidatorDictionary: IFieldValidatorDictionary,
    formData: IFormData
  ): IFormValidationResponse {
    const fields = Object.entries(formData);

    // const fields = Object.keys(fieldValidatorDictionary).reduce((formData, field) => {
    //   if (formData.hasOwnProperty(field) {
    //
    //   }
    // }, {})

    return fields.reduce((validatorResponse, [fieldId, value]) => {
      validatorResponse[fieldId] = {
        value: value,
        ...fieldValidatorDictionary[fieldId].validate(value),
      };

      return validatorResponse;
    }, {});
  }

  errorSummary(
    fieldValidatorDictionary: IFieldValidatorDictionary,
    formData: IFormData
  ): IFormError[] {
    const validatedFields = Object.entries(
      this.validate(fieldValidatorDictionary, formData)
    );

    return validatedFields
      .filter(([, field]) => !field.valid)
      .map(([id, field]) => {
        return { fieldId: id, errors: field.errors };
      });
  }

  hasErrors(
    fieldValidatorDictionary: IFieldValidatorDictionary,
    formData: IFormData
  ): boolean {
    return this.errorSummary(fieldValidatorDictionary, formData).length > 0;
  }
}
