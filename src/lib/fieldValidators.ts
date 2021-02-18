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
