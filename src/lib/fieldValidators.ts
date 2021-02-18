export interface IFieldValidator {
  validate(value: string): IFieldValidationResponse;
}

export interface IFieldValidationResponse {
  value: string;
  errors: string[];
  valid: boolean;
  invalid: boolean;
}

export interface FieldRule {
  error: string;
  predicateFn: (valueToValidate: string) => boolean;
}

export abstract class FieldValidator implements IFieldValidator {
  protected _rules: FieldRule[];

  validate(value: string): IFieldValidationResponse {
    return {
      value: value,
      valid: this.isValid(value),
      invalid: !this.isValid(value),
      errors: this.errors(value),
    };
  }

  static valueViolatesRule(value: string, rule: FieldRule): boolean {
    return rule.predicateFn(value);
  }

  private isValid(value: string): boolean {
    return !this._rules.some((rule) =>
      FieldValidator.valueViolatesRule(value, rule)
    );
  }

  private errors(value: string): string[] {
    return this._rules
      .filter((rule) => FieldValidator.valueViolatesRule(value, rule))
      .map((rule) => rule.error);
  }
}

export class BeaconModelValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        error: "Beacon model is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class BeaconManufacturerValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        error: "Beacon manufacturer is a required field",
        predicateFn: (value) => value.length === 0,
      },
    ];
  }
}

export class BeaconHexIdValidator extends FieldValidator {
  constructor() {
    super();
    this._rules = [
      {
        error: "Beacon HEX ID must be exactly 15 characters",
        predicateFn: (value) => value.length !== 15,
      },
    ];
  }
}

export const fieldValidatorLookup = {
  manufacturer: new BeaconManufacturerValidator(),
  model: new BeaconModelValidator(),
  hexId: new BeaconHexIdValidator(),
};

// Previous code, required by check-beacon-details.tsx

import {
  ValidatorFunction,
  emptyRequiredField,
  isNot15CharactersLong,
} from "./validatorFunctions";

interface FieldRule_ {
  validatorFunction: ValidatorFunction;
  errorMessage: string;
}

export class FieldValidators {
  private _fieldId: string;
  private _value: string;
  private _rules: FieldRule_[];

  constructor(fieldId: string) {
    this._fieldId = fieldId;
    this._rules = [];
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get fieldId(): string {
    return this._fieldId;
  }

  hasError(): boolean {
    if (this._rules.length >= 1) {
      return this._rules
        .map((rule) => rule.validatorFunction(this.value))
        .includes(true);
    }
    return false;
  }

  errorMessages(): string[] {
    return this._rules
      .filter((rule) => rule.validatorFunction(this.value))
      .map((rule) => rule.errorMessage);
  }

  // Declarative matcher-type syntax starts here -- possibly extract?
  should(): FieldValidators {
    return this;
  }

  containANonEmptyString(): FieldValidators {
    const rule = {
      validatorFunction: emptyRequiredField,
      errorMessage: "",
    };
    this._rules.push(rule);
    return this;
  }

  beExactly15Characters(): FieldValidators {
    const rule = {
      validatorFunction: isNot15CharactersLong,
      errorMessage: "",
    };
    this._rules.push(rule);
    return this;
  }

  withErrorMessage(message: string): FieldValidators {
    this._rules[this._rules.length - 1].errorMessage = message;
    return this;
  }
}
