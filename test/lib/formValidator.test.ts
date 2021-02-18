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
  });
});
