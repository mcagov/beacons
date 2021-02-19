import { FormValidator } from "../../src/lib/formValidator";
import { IFieldValidator } from "../../src/lib/fieldValidators";

const mockValidFieldValidator = (): IFieldValidator => {
  return {
    validate: jest.fn(() => {
      return {
        valid: true,
        invalid: false,
        errors: [],
      };
    }),
  };
};

const mockInvalidFieldValidator = (errors): IFieldValidator => {
  return {
    validate: jest.fn(() => {
      return {
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
      const fieldValidatorLookup = {
        testFieldId: mockValidFieldValidator(),
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        testFieldId: {
          valid: true,
          invalid: false,
          errors: [],
        },
      });
    });

    it("when given a form data object with an invalid field, returns an 'invalid' response", () => {
      const formData = { anotherTestFieldId: "invalid value" };
      const fieldValidatorLookup = {
        anotherTestFieldId: mockInvalidFieldValidator(["TooLong"]),
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        anotherTestFieldId: {
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
      const fieldValidatorLookup = {
        firstTestFieldId: mockInvalidFieldValidator(["Required"]),
        secondTestFieldId: mockValidFieldValidator(),
      };

      const validationResponse = FormValidator.validate(
        formData,
        fieldValidatorLookup
      );

      expect(validationResponse).toEqual({
        firstTestFieldId: {
          valid: false,
          invalid: true,
          errors: ["Required"],
        },
        secondTestFieldId: {
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
      const fieldValidatorLookup = {
        validFieldId: mockValidFieldValidator(),
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
      const fieldValidatorLookup = {
        invalidFieldId: mockInvalidFieldValidator(["TooLong"]),
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
      const fieldValidatorLookup = {
        invalidFieldId1: mockInvalidFieldValidator(["TooLong"]),
        invalidFieldId2: mockInvalidFieldValidator(["TooLong"]),
        validFieldId: mockValidFieldValidator(),
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
