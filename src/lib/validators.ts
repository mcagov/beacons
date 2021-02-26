import { FieldValidator, IFieldValidator } from "./fieldValidator";
import { ValidatorFunction } from "./validatorFunctions";

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

/**
 * Provides a set of validators that can be used within the {@link FormValidator}.
 */
export class Validators {
  /**
   * Validator that requires the value to be non-empty.
   *
   * @param errorMessage {string}            An error message if the rule is violated
   * @returns            {IFieldValidator}   The field validator instance
   */
  public static required(errorMessage: string): IFieldValidator {
    const validatorFn: ValidatorFunction = (value) => !value;
    return new FieldValidator();
  }

  /**
   * Validator that requires the value to be less than or equal to the provided number.
   *
   * @param errorMessage {string}            An error message if the rule is violated
   * @param max          {number}            The max number of characters allowed
   * @returns            {IFieldValidator}   A validator instance
   */
  public static max(errorMessage: string, max: number): IFieldValidator {
    return null;
  }

  /**
   * Validator that requires the value to match a regular expression pattern provided.
   *
   * @param errorMessage {string}            An error message if the rule is violated
   * @param pattern      {RegExp}            A regular expression to be used to test the value
   * @returns            {IFieldValidator}   A validator instance
   */
  public static pattern(
    errorMessage: string,
    pattern: RegExp
  ): IFieldValidator {
    return null;
  }
}
