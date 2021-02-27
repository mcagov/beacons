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
  public static maxLength(errorMessage: string, max: number): ValidationRule {
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
  public static isLength(errorMessage: string, length: number): ValidationRule {
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
   * Validator that requires the value to be a number; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static wholeNumber(errorMessage: string): ValidationRule {
    const wholeNumberRegex = /^[0-9]+$/;
    return Validators.pattern(errorMessage, wholeNumberRegex);
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
   * Validator that requires the value to be a valid postcode; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static postcode(errorMessage: string): ValidationRule {
    const emailRegex = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;
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
      const parentControl: AbstractControl = control.parent.controls[key];
      const conditionIsMet = parentControl.value === value;
      if (conditionIsMet) {
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
