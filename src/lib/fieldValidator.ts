import { ValidatorFunction, emptyRequiredField } from "./validatorFunctions";

interface FieldRule {
  validatorFunction: ValidatorFunction;
  errorMessage: string;
}

export class FieldValidator {
  private _fieldId: string;
  private _value: string;
  private _rules: FieldRule[];

  constructor(name: string) {
    this._fieldId = name;
    this._rules = [];
  }

  get value(): string {
    return this._value;
  }

  set value(value) {
    this._value = value;
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
  should(): FieldValidator {
    return this;
  }

  containANonEmptyString(): FieldValidator {
    const rule = {
      validatorFunction: emptyRequiredField,
      errorMessage: "",
    };
    this._rules.push(rule);
    return this;
  }

  withErrorMessage(message): FieldValidator {
    this._rules[this._rules.length - 1].errorMessage = message;
    return this;
  }
}
