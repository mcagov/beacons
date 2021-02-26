import { FieldValidator } from "../fieldValidator";

export class ManufacturerSerialNumberValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        errorMessage:
          "Beacon manufacturer serialise number is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class MonthValidator extends FieldValidator {
  constructor(public errorMessagePrefix: string) {
    super();
    this._rules = [
      {
        errorMessage: `${this.errorMessagePrefix} must be a whole number`,
        predicateFn: (value) => value.match(/\D+/) !== null,
      },
      {
        errorMessage: `${this.errorMessagePrefix} must be 2 numbers long`,
        predicateFn: (value) => value.length !== 2 && value !== "",
      },
    ];
  }
}

export class YearValidator extends FieldValidator {
  constructor(public errorMessagePrefix: string) {
    super();
    this._rules = [
      {
        errorMessage: `${this.errorMessagePrefix} must be a whole number`,
        predicateFn: (value) => value.match(/\D+}/) !== null,
      },
      {
        errorMessage: `${this.errorMessagePrefix} must be 4 numbers long`,
        predicateFn: (value) => value.length !== 4 && value !== "",
      },
    ];
  }
}

export const beaconInformationFieldValidators = {
  manufacturerSerialNumber: new ManufacturerSerialNumberValidator(),
  batteryExpiryDateMonth: new MonthValidator("Battery expiry month"),
  batteryExpiryDateYear: new YearValidator("Battery expiry year"),
  lastServicedDateMonth: new MonthValidator("Last serviced month"),
  lastServicedDateYear: new YearValidator("Last serviced year"),
};
