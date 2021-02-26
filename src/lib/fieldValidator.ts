export interface IFieldValidator {
  validate(value: string): IFieldValidationResponse;
}

export interface IFieldValidationResponse {
  errorMessages: string[];
  valid: boolean;
  invalid: boolean;
}

/**
 * Type definition for a function that validates a form value and returns true if the value violates the rule.
 *
 * @param valueToValidate {string}    The form value to validate
 * @returns               {boolean}   True if the value violates the rule
 */
export type ValidatorFn = (valueToValidate: string) => boolean;

export interface FieldRule {
  errorMessage: string;
  hasErrorFn: ValidatorFn;
}

export class FieldValidator implements IFieldValidator {
  protected _rules: FieldRule[];

  validate(value: string): IFieldValidationResponse {
    return {
      valid: this.isValid(value),
      invalid: !this.isValid(value),
      errorMessages: this.errorMessages(value),
    };
  }

  static valueViolatesRule(value: string, rule: FieldRule): boolean {
    return rule.hasErrorFn(value);
  }

  private isValid(value: string): boolean {
    return !this._rules.some((rule) =>
      FieldValidator.valueViolatesRule(value, rule)
    );
  }

  private errorMessages(value: string): string[] {
    return this._rules
      .filter((rule) => FieldValidator.valueViolatesRule(value, rule))
      .map((rule) => rule.errorMessage);
  }
}
