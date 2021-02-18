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

export class FormValidator {
  validate(
    fieldValidatorDictionary: IFieldValidatorDictionary,
    formData: IFormData
  ): IFormValidationResponse {
    const fields = Object.entries(formData);

    return fields.reduce((validatorResponse, [fieldId, value]) => {
      validatorResponse[fieldId] = {
        value: value,
        ...fieldValidatorDictionary[fieldId].validate(value),
      };

      return validatorResponse;
    }, {});
  }
}
