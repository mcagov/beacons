import { HexIdParser } from "../hexIdParser/HexIdParser";
import { AbstractFormNode } from "./AbstractFormNode";
import { ValidationRule } from "./Validators";

export type ValidationCondition = {
  dependsOn: string;
  meetingCondition: (value: string) => boolean;
};

export type FieldJSON = {
  value: string;
  errorMessages: string[];
};

/**
 * This class is responsible for managing the value of a form input and can run validation rules, and calculate status of the field input.
 */
export class FieldManager extends AbstractFormNode {
  private _keywordMap = {
    HEX_ID_COUNTRY: (hexId) => HexIdParser.countryName(hexId),
  };

  constructor(
    value: string,
    public readonly validators: ValidationRule[] = [],
    public readonly conditions: ValidationCondition[] = []
  ) {
    super(value);
    this._value = value ? value : "";
  }

  /**
   * Public getter for the value this input manages.
   * @override
   */
  public get value(): string {
    return this._value as string;
  }

  /**
   * Validates this field input against the validation rules.
   *
   * @returns {string[]}   The array of error messages
   */
  public errorMessages(): string[] {
    const validators = this.hasErrors() ? this.validators : [];

    return validators
      .filter((rule: ValidationRule) => rule.applies(this.value))
      .map((rule: ValidationRule) => rule.errorMessage)
      .map((errorMessage) => this.replaceKeywords(errorMessage));
  }

  /**
   * Determines if the input has any errors.
   */
  public hasErrors(): boolean {
    if (this.pristine) {
      return false;
    }

    if (!this.shouldValidate()) {
      return false;
    }

    return this.validators.some((rule: ValidationRule) =>
      rule.applies(this.value)
    );
  }

  public serialise(): FieldJSON {
    const value = this._value;
    const errorMessages = this.errorMessages();

    return { value, errorMessages };
  }

  private shouldValidate(): boolean {
    return this.conditions.every((validationCondition) => {
      const dependsOnField = this.parent.fields[validationCondition.dependsOn];
      if (dependsOnField === undefined) {
        throw ReferenceError(
          `${validationCondition.dependsOn} not found in parent form.  Is the field name correct?`
        );
      }
      const meetsCondition = validationCondition.meetingCondition;

      return meetsCondition(dependsOnField.value);
    });
  }

  private replaceKeywords(errorMessage: string): string {
    const keywords = Object.keys(this._keywordMap);

    return keywords.reduce((errorMessage, keyword) => {
      const keywordRegex = new RegExp("%" + keyword + "%", "g");

      if (keywordRegex.test(errorMessage))
        return errorMessage.replace(
          keywordRegex,
          this._keywordMap[keyword](this.value)
        );

      return errorMessage;
    }, errorMessage);
  }
}
