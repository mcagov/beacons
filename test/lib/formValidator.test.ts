import { IFieldValidator } from "../../src/lib/fieldValidator";
import { FormValidator } from "../../src/lib/formValidator";

const mockValidFieldValidator = (): IFieldValidator => {
  return {
    validate: jest.fn(() => {
      return {
        valid: true,
        invalid: false,
        errorMessages: [],
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
        errorMessages: errors,
      };
    }),
  };
};

describe("FormValidator", () => {
  describe("validate", () => {
    it("should return a 'valid' response when the only field is valid", () => {
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
          errorMessages: [],
        },
      });
    });

    it("should return an 'invalid' response when the only field is invalid", () => {
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
          errorMessages: ["TooLong"],
        },
      });
    });

    it("should return an 'invalid' response when one of two fields is invalid", () => {
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
          errorMessages: ["Required"],
        },
        secondTestFieldId: {
          valid: true,
          invalid: false,
          errorMessages: [],
        },
      });
    });
  });

  describe("errorSummary", () => {
    it("should return a blank errorMessage summary when the only field is valid", () => {
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

    it("should return a summary of one errorMessage when the only field is invalid", () => {
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
        { fieldId: "invalidFieldId", errorMessages: ["TooLong"] },
      ]);
    });

    it("should return a summary of two errorMessages when two fields are invalid", () => {
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
        { fieldId: "invalidFieldId1", errorMessages: ["TooLong"] },
        { fieldId: "invalidFieldId2", errorMessages: ["TooLong"] },
      ]);
    });
  });
});
