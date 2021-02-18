import { FormValidator } from "../../src/lib/formValidator";
import { IFieldValidator } from "../../src/lib/fieldValidators";

const mockValidFieldValidator = (value): IFieldValidator => {
  return {
    validate: jest.fn(() => {
      return {
        value: value,
        valid: true,
        invalid: false,
        errors: [],
      };
    }),
  };
};

const mockInvalidFieldValidator = (value, errors): IFieldValidator => {
  return {
    validate: jest.fn(() => {
      return {
        value: value,
        valid: false,
        invalid: true,
        errors: errors,
      };
    }),
  };
};

describe("FormValidator", () => {
  describe("validate", () => {
    it("when given a form data object with a valid field, returns a 'valid' response", () => {
      const formData = { testFieldId: "valid value" };
      const fieldValidator = mockValidFieldValidator("valid value");
      const fieldValidatorLookup = {
        testFieldId: fieldValidator,
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        testFieldId: {
          value: "valid value",
          valid: true,
          invalid: false,
          errors: [],
        },
      });
    });

    it("when given a form data object with an invalid field, returns an 'invalid' response", () => {
      const formData = { anotherTestFieldId: "invalid value" };
      const fieldValidator = mockInvalidFieldValidator("invalid value", [
        "TooLong",
      ]);
      const fieldValidatorLookup = {
        anotherTestFieldId: fieldValidator,
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        anotherTestFieldId: {
          value: "invalid value",
          valid: false,
          invalid: true,
          errors: ["TooLong"],
        },
      });
    });

    it("when given a form data object with one valid and one invalid field, returns an 'invalid' response", () => {
      const formData = {
        firstTestFieldId: "invalid value",
        secondTestFieldId: "valid value",
      };
      const fieldValidator1 = mockInvalidFieldValidator("invalid value", [
        "Required",
      ]);
      const fieldValidator2 = mockValidFieldValidator("valid value");
      const fieldValidatorLookup = {
        firstTestFieldId: fieldValidator1,
        secondTestFieldId: fieldValidator2,
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        firstTestFieldId: {
          value: formData.firstTestFieldId,
          valid: false,
          invalid: true,
          errors: ["Required"],
        },
        secondTestFieldId: {
          value: formData.secondTestFieldId,
          valid: true,
          invalid: false,
          errors: [],
        },
      });
    });
  });

  describe("errorSummary", () => {
    it("when given a form data object with a valid field, returns a blank error summary", () => {
      const formData = {
        validFieldId: "valid value",
      };
      const fieldValidator = mockValidFieldValidator("valid value");
      const fieldValidatorLookup = {
        validFieldId: fieldValidator,
      };

      const errorSummary = FormValidator.errorSummary(
        formData,
        fieldValidatorLookup
      );

      expect(errorSummary).toEqual([]);
    });

    it("when given a form data object with an invalid field, returns an error summary with one error", () => {
      const formData = {
        invalidFieldId: "invalid value",
      };
      const fieldValidator = mockInvalidFieldValidator("invalid value", [
        "TooLong",
      ]);
      const fieldValidatorLookup = {
        invalidFieldId: fieldValidator,
      };

      const errorSummary = FormValidator.errorSummary(
        formData,
        fieldValidatorLookup
      );

      expect(errorSummary).toEqual([
        { fieldId: "invalidFieldId", errors: ["TooLong"] },
      ]);
    });

    it("when given a form data object with some invalid fields, returns an error summary with only the errors", () => {
      const formData = {
        invalidFieldId1: "invalid value",
        invalidFieldId2: "invalid value",
        validFieldId: "valid value",
      };
      const fieldValidator1 = mockInvalidFieldValidator("invalid value", [
        "TooLong",
      ]);
      const fieldValidator2 = mockValidFieldValidator("valid value");
      const fieldValidatorLookup = {
        invalidFieldId1: fieldValidator1,
        invalidFieldId2: fieldValidator1,
        validFieldId: fieldValidator2,
      };

      const errorSummary = FormValidator.errorSummary(
        formData,
        fieldValidatorLookup
      );

      expect(errorSummary).toEqual([
        { fieldId: "invalidFieldId1", errors: ["TooLong"] },
        { fieldId: "invalidFieldId2", errors: ["TooLong"] },
      ]);
    });
  });
});
