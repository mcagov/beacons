import { IFieldValidator } from "./fieldValidator";

/**
 * Provides a set of validators that can be used within the {@link FormValidator}.
 */
export class Validators {
  /**
   * Validator that requires the value to be non-empty.
   *
   * @param errorMessage {string}            The error message to return if the rule is violated
   * @returns            {IFieldValidator}   The field validator instance
   */
  public static required(errorMessage: string): IFieldValidator {
    return null;
  }

  /**
   * Validator that requires the value to be less than or equal to the provided number.
   *
   * @param errorMessage {string}            The error message to return if the rule is violated
   * @param max          {number}            The max number of characters allowed
   * @returns            {IFieldValidator}   The field validator instance
   */
  public static max(errorMessage: string, max: number): IFieldValidator {
    return null;
  }
}
