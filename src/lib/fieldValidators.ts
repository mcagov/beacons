export interface IFieldValidator {
  validate(value: string): { valid: boolean; errors: string[] };
}

class FieldValidator implements IFieldValidator {
  _rules;

  validate(value: string): { valid: boolean; errors: string[] } {
    return { valid: this.isValid(value), errors: this.errors(value) };
  }

  static valueViolatesRule(
    value: string,
    rule: { error: string; predicateFn(value: string): boolean }
  ) {
    return rule.predicateFn(value);
  }

  private isValid(value: string) {
    return !this._rules.some((rule) =>
      FieldValidator.valueViolatesRule(value, rule)
    );
  }

  private errors(value: string) {
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

// Previous code, required by check-beacon-details.tsx

import {
  ValidatorFunction,
  emptyRequiredField,
  isNot15CharactersLong,
} from "./validatorFunctions";

interface FieldRule {
  validatorFunction: ValidatorFunction;
  errorMessage: string;
}

export class FieldValidators {
  private _fieldId: string;
  private _value: string;
  private _rules: FieldRule[];

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
