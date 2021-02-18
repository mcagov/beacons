import { FormValidator } from "../../src/lib/formValidator";

describe("FormValidator", () => {
  describe("validate", () => {
    it("when given a form data object with a valid field, returns a 'valid' response", () => {
      const formData = { testFieldId: "valid value" };
      const mockFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.testFieldId,
            valid: true,
            errors: [],
          };
        }),
      };
      const fieldValidatorDictionary = {
        testFieldId: mockFieldValidator,
      };
      const testFormValidator = new FormValidator();

      const validationResponse = testFormValidator.validate(
        fieldValidatorDictionary,
        formData
      );

      expect(validationResponse).toEqual({
        testFieldId: {
          value: "valid value",
          valid: true,
          errors: [],
        },
      });
    });

    it("when given a form data object with an invalid field, returns an 'invalid' response", () => {
      const formData = { anotherTestFieldId: "invalid value" };
      const mockFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.anotherTestFieldId,
            valid: false,
            errors: ["TooLong"],
          };
        }),
      };
      const fieldValidatorDictionary = {
        anotherTestFieldId: mockFieldValidator,
      };
      const testFormValidator = new FormValidator();

      const validationResponse = testFormValidator.validate(
        fieldValidatorDictionary,
        formData
      );

      expect(validationResponse).toEqual({
        anotherTestFieldId: {
          value: "invalid value",
          valid: false,
          // Should we create our own FormError classes to communicate errors? (Not error messages)
          errors: ["TooLong"],
        },
      });
    });

    it("when given a form data object with one valid and one invalid field, returns an 'invalid' response", () => {
      const formData = {
        firstTestFieldId: "invalid value",
        secondTestFieldId: "valid value",
      };
      const mockFirstTestFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.firstTestFieldId,
            valid: false,
            errors: ["Required"],
          };
        }),
      };
      const mockSecondTestFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.secondTestFieldId,
            valid: true,
            errors: [],
          };
        }),
      };
      const fieldValidatorDictionary = {
        firstTestFieldId: mockFirstTestFieldValidator,
        secondTestFieldId: mockSecondTestFieldValidator,
      };
      const testFormValidator = new FormValidator();

      const validationResponse = testFormValidator.validate(
        fieldValidatorDictionary,
        formData
      );

      expect(validationResponse).toEqual({
        firstTestFieldId: {
          value: formData.firstTestFieldId,
          valid: false,
          // Should we create our own FormError classes to communicate errors? (Not error messages)
          errors: ["Required"],
        },
        secondTestFieldId: {
          value: formData.secondTestFieldId,
          valid: true,
          errors: [],
        },
      });
    });

    xit("when given an empty form data object missing required fields, returns an 'invalid' response", () => {
      const formData = {};
      const mockRequiredFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: "",
            valid: false,
            errors: ["Required"],
          };
        }),
      };
      const fieldValidatorDictionary = {
        requiredFieldId: mockRequiredFieldValidator,
      };
      const testFormValidator = new FormValidator();

      const validationResponse = testFormValidator.validate(
        fieldValidatorDictionary,
        formData
      );

      expect(validationResponse).toEqual({
        firstTestFieldId: {
          value: "",
          valid: false,
          errors: ["Required"],
        },
      });
    });
  });

  describe("errorSummary", () => {
    it("when given a form data object with a valid field, returns a blank error summary", () => {
      const formData = {
        validFieldId: "valid value",
      };
      const mockValidFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.validFieldId,
            valid: true,
            errors: [],
          };
        }),
      };
      const fieldValidatorDictionary = {
        validFieldId: mockValidFieldValidator,
      };
      const formValidator = new FormValidator();

      const errorSummary = formValidator.errorSummary(
        fieldValidatorDictionary,
        formData
      );

      expect(errorSummary).toEqual([]);
    });

    it("when given a form data object with an invalid field, returns an error summary with one error", () => {
      const formData = {
        invalidFieldId: "invalid value",
      };
      const mockInvalidFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: formData.invalidFieldId,
            valid: false,
            errors: ["TooLong"],
          };
        }),
      };
      const fieldValidatorDictionary = {
        invalidFieldId: mockInvalidFieldValidator,
      };
      const formValidator = new FormValidator();

      const errorSummary = formValidator.errorSummary(
        fieldValidatorDictionary,
        formData
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
      const mockInvalidFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: "invalid value",
            valid: false,
            errors: ["TooLong"],
          };
        }),
      };
      const mockValidFieldValidator = {
        validate: jest.fn(() => {
          return {
            value: "valid value",
            valid: true,
            errors: [],
          };
        }),
      };
      const fieldValidatorDictionary = {
        invalidFieldId1: mockInvalidFieldValidator,
        invalidFieldId2: mockInvalidFieldValidator,
        validFieldId: mockValidFieldValidator,
      };
      const formValidator = new FormValidator();

      const errorSummary = formValidator.errorSummary(
        fieldValidatorDictionary,
        formData
      );

      expect(errorSummary).toEqual([
        { fieldId: "invalidFieldId1", errors: ["TooLong"] },
        { fieldId: "invalidFieldId2", errors: ["TooLong"] },
      ]);
    });
  });
});
