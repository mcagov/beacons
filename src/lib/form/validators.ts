import { AbstractControl } from "./abstractControl";

/**
 * Type definition for a function that validates a form value and returns true if the value violates the rule.
 *
 * @param control {AbstractControl}   The form control to validate
 * @returns       {boolean}           True if the value violates the rule
 */
export type ValidatorFn = (control: AbstractControl) => boolean;

export interface ValidationRule {
  errorMessage: string;
  hasErrorFn: ValidatorFn;
}

/**
 * Provides a set of validators that can be used within the {@link FormControl}.
 */
export class Validators {
  /**
   * Validator that requires the value to be non-empty.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static required(errorMessage: string): ValidationRule {
    const hasErrorFn: ValidatorFn = (control: AbstractControl) =>
      !control.value;

    return {
      errorMessage,
      hasErrorFn,
    };
  }

  /**
   * Validator that requires the value to be less than or equal to the provided number.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param max          {number}           The max number of characters allowed
   * @returns            {ValidationRule}   A validation rule
   */
  public static max(errorMessage: string, max: number): ValidationRule {
    const hasErrorFn: ValidatorFn = (control) => control.value.length > max;

    return { errorMessage, hasErrorFn };
  }

  /**
   * Validator that requires the value to be strictly the length provided.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param length       {string}           The length the value should be
   * @returns            {ValidationRule}   A validation rule
   */
  public static isSize(errorMessage: string, length: number): ValidationRule {
    const hasErrorFn: ValidatorFn = (control) =>
      control.value.length !== length;

    return { errorMessage, hasErrorFn };
  }

  /**
   * Validator that requires the value to be a valid hex id; proxies through to the {@link Validators.pattern()}.
   *
   * @param erroMessage {string}           An error message if the rule is violated
   * @returns           {ValidationRule}   A validation rule
   */
  public static hexId(erroMessage: string): ValidationRule {
    const hexIdRegex = /^[a-f0-9]+$/i;
    return Validators.pattern(erroMessage, hexIdRegex);
  }

  /**
   * Validator that requires the value to be a valid email; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static email(errorMessage: string): ValidationRule {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return Validators.pattern(errorMessage, emailRegex);
  }

  /**
   * Convenience static method to return a validator that requires the value to match a regular expression pattern provided.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param pattern      {RegExp}           A regular expression to be used to test the value
   * @returns            {ValidationRule}   A validation rule
   */
  private static pattern(
    errorMessage: string,
    pattern: RegExp
  ): ValidationRule {
    const hasErrorFn: ValidatorFn = (control) => !pattern.test(control.value);

    return { errorMessage, hasErrorFn };
  }

  public static conditionalOnValue(
    errorMessage: string,
    key: string,
    value: any,
    hasErrorCallback: ValidatorFn
  ): ValidationRule {
    const hasErrorFn: ValidatorFn = (control) => {
      const conditionIsMet = control.parent.controls[key].value === value;
      if (conditionIsMet) {
        console.log(control.value);
        return hasErrorCallback(control);
      }
      return false;
    };
    return { errorMessage, hasErrorFn };
  }

  private constructor() {
    // Prevent external instantiation.
  }
}
