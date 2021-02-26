import { FieldValidator } from "../fieldValidator";

export class FullNameValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Emergency Contact Full name is a required field",
        hasErrorFn: (value) => value.length === 0,
      },
    ];
  }
}

export class TelephoneValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage: "Emergency Contact Telephone is a required field",
        hasErrorFn: (value) => value.length === 0,
      },
    ];
  }
}

export const emergencyContactFieldValidatorLookup = {
  emergencyContact1FullName: new FullNameValidator(),
  emergencyContact1TelephoneNumber: new TelephoneValidator(),
};
