/**
 * Type definition for a function that validates a form value and returns true if the value violates the rule.
 *
 * @param value {string}    The form value to validate
 * @returns     {boolean}   True if the value violates the rule
 */
export type ValidatorFn = (value: string) => boolean;

export interface FieldRule {
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
   * @param errorMessage {string}      An error message if the rule is violated
   * @returns            {FieldRule}   A field rule
   */
  public static required(errorMessage: string): FieldRule {
    const hasErrorFn: ValidatorFn = (value) => !value;

    return {
      errorMessage,
      hasErrorFn,
    };
  }

  /**
   * Validator that requires the value to be less than or equal to the provided number.
   *
   * @param errorMessage {string}      An error message if the rule is violated
   * @param max          {number}      The max number of characters allowed
   * @returns            {FieldRule}   A field rule
   */
  public static max(errorMessage: string, max: number): FieldRule {
    const hasErrorFn: ValidatorFn = (value) => value.length > max;

    return { errorMessage, hasErrorFn };
  }

  /**
   * Validator that requires the value to be strictly the length provided.
   *
   * @param errorMessage {string}      An error message if the rule is violated
   * @param length       {string}      The length the value should be
   * @returns            {FieldRule}   A field rule
   */
  public static isSize(errorMessage: string, length: number): FieldRule {
    const hasErrorFn: ValidatorFn = (value) => value.length !== length;

    return { errorMessage, hasErrorFn };
  }

  /**
   * Validator that requires the value to be a valid hex id; proxies through to the {@link Validators.pattern()}.
   *
   * @param erroMessage {string}      An error message if the rule is violated
   * @returns           {FieldRule}   A validator instance
   */
  public static hexId(erroMessage: string): FieldRule {
    const hexIdRegex: RegExp = /^[a-f0-9]+$/i;
    return Validators.pattern(erroMessage, hexIdRegex);
  }

  /**
   * Validator that requires the value to be a valid email; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}      An error message if the rule is violated
   * @returns            {FieldRule}   A validator instance
   */
  public static email(errorMessage: string): FieldRule {
    const emailRegex: RegExp = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return Validators.pattern(errorMessage, emailRegex);
  }

  /**
   * Convenience static method to return a validator that requires the value to match a regular expression pattern provided.
   *
   * @param errorMessage {string}      An error message if the rule is violated
   * @param pattern      {RegExp}      A regular expression to be used to test the value
   * @returns            {FieldRule}   A field rule
   */
  private static pattern(errorMessage: string, pattern: RegExp): FieldRule {
    const hasErrorFn: ValidatorFn = (value) => !pattern.test(value);

    return { errorMessage, hasErrorFn };
  }

  private constructor() {
    // Prevent external instantiation.
  }
}
