/**
 * Type definition for a function that validates a form input and returns true if the value violates the rule.
 *
 * @param formNode {string}    The form value to validate
 * @returns        {boolean}   True if the value violates the rule
 */
export type ValidatorFn = (value: string) => boolean;

export interface ValidationRule {
  errorMessage: string;
  applies: ValidatorFn;
}

/**
 * Provides a set of validators that can be applied to a value.
 */
export class Validators {
  /**
   * Validator that requires the form input value to be non-empty.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static required(errorMessage: string): ValidationRule {
    const applies: ValidatorFn = (value: string) => !value;

    return {
      errorMessage,
      applies,
    };
  }

  /**
   * Validator that requires the form input value to be less than or equal to the provided number.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param max          {number}           The max number of characters allowed
   * @returns            {ValidationRule}   A validation rule
   */
  public static maxLength(errorMessage: string, max: number): ValidationRule {
    const applies: ValidatorFn = (value: string) => value.length > max;

    return { errorMessage, applies };
  }

  /**
   * Validator that requires the form input value to be strictly the length provided.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param length       {string}           The length the value should be
   * @returns            {ValidationRule}   A validation rule
   */
  public static isLength(errorMessage: string, length: number): ValidationRule {
    const applies: ValidatorFn = (value: string) => value.length !== length;

    return { errorMessage, applies };
  }

  /**
   * Validator that requires the form input less than or equal to the number provided.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param maxLength    {number}           The number the value should be greater than
   * @returns            {ValidationRule}   A validation rule
   */
  public static max(errorMessage: string, maxLength: number): ValidationRule {
    const applies: ValidatorFn = (value: string) => {
      const valueAsNumber = parseInt(value);
      return !isNaN(valueAsNumber) && valueAsNumber > maxLength;
    };

    return { errorMessage, applies };
  }

  /**
   * Validator that requires the form input number to be greater than or equal to the number provided.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @param minLength    {number}           The number the value should be greater than
   * @returns            {ValidationRule}   A validation rule
   */
  public static min(errorMessage: string, minLength: number): ValidationRule {
    const applies: ValidatorFn = (value: string) => {
      const valueAsNumber = parseInt(value);
      return !isNaN(valueAsNumber) && valueAsNumber < minLength;
    };

    return { errorMessage, applies };
  }

  /**
   * Validator that requires the form input value to be a valid hex id; proxies through to the {@link Validators.pattern()}.
   *
   * @param erroMessage {string}           An error message if the rule is violated
   * @returns           {ValidationRule}   A validation rule
   */
  public static hexId(erroMessage: string): ValidationRule {
    const hexIdRegex = /^[a-f0-9]+$/i;
    return Validators.pattern(erroMessage, hexIdRegex);
  }

  /**
   * Validator that requires the form input value to be a number; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static wholeNumber(errorMessage: string): ValidationRule {
    const wholeNumberRegex = /^$|^[0-9]+$/;
    return Validators.pattern(errorMessage, wholeNumberRegex);
  }

  /**
   * Validator that requires the form input value to be a valid email; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static email(errorMessage: string): ValidationRule {
    const emailRegex = /^$|[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}/;
    return Validators.pattern(errorMessage, emailRegex);
  }

  /**
   * Validator that requires the form input value to be a valid postcode; proxies through to the {@link Validators.pattern()}.
   *
   * @param errorMessage {string}           An error message if the rule is violated
   * @returns            {ValidationRule}   A validation rule
   */
  public static postcode(errorMessage: string): ValidationRule {
    const emailRegex = /^$|([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})/;
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
    const applies: ValidatorFn = (value: string) => !pattern.test(value);

    return { errorMessage, applies };
  }

  private constructor() {
    // Prevent external instantiation.
  }
}
