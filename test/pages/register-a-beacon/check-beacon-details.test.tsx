import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import CheckBeaconDetails, {
  definePageForm,
} from "../../../src/pages/register-a-beacon/check-beacon-details";

describe("CheckBeaconDetails", () => {
  it("should have a back button which directs the user to the service start page", () => {
    const form: FormJSON = {
      hasErrors: false,
      fields: {
        model: {
          value: "",
          errorMessages: [],
        },
        manufacturer: {
          value: "",
          errorMessages: [],
        },
        hexId: {
          value: "",
          errorMessages: [],
        },
      },
      errorSummary: [],
    };

    render(<CheckBeaconDetails form={form} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/"
    );
  });
});

describe("CheckBeaconDetails form validation", () => {
  const validUkHexId = "1D0EA08C52FFBFF";
  const ukHexIdWith1ExtraCharacter = "1D0EA08C52FFBFF0";
  const stringWithNonHexadecimalChars = "1D0EA08C52FFBFX";
  const validOtherCountryHexId = "C00F429578002C1";

  it("should require beacon manufacturer", () => {
    const fieldValues = {
      manufacturer: "",
      model: "Test model",
      hexId: validUkHexId,
    };
    const expectedErrorMessages = [expect.stringContaining("required")];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.manufacturer.errorMessages.length).toBe(1);
    expect(validationResult.fields.manufacturer.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it("should require beacon model", () => {
    const fieldValues = {
      manufacturer: "Test manufacturer",
      model: "",
      hexId: validUkHexId,
    };
    const expectedErrorMessages = [expect.stringContaining("required")];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.model.errorMessages.length).toBe(1);
    expect(validationResult.fields.model.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it("should require hexId", () => {
    const fieldValues = {
      manufacturer: "Test manufacturer",
      model: "Test model",
      hexId: "",
    };
    const expectedErrorMessages = [expect.stringContaining("required")];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it("should error if hex string is not 15 characters long", () => {
    const fieldValues = {
      manufacturer: "Test manufacturer",
      model: "Test model",
      hexId: ukHexIdWith1ExtraCharacter,
    };
    const expectedErrorMessages = [expect.stringContaining("15 characters")];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it("should error if hexId string is not hexadecimal", () => {
    const fieldValues = {
      manufacturer: "Test manufacturer",
      model: "Test model",
      hexId: stringWithNonHexadecimalChars,
    };
    const expectedErrorMessages = [
      expect.stringContaining("numbers 0 to 9 and letters A to F"),
      expect.stringContaining("UK-encoded"),
    ];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages.length).toBe(2);
    expect(validationResult.fields.hexId.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });

  it("should error if hexId is not UK-encoded", () => {
    const fieldValues = {
      manufacturer: "Test manufacturer",
      model: "Test model",
      hexId: validOtherCountryHexId,
    };
    const expectedErrorMessages = [expect.stringContaining("UK-encoded")];
    const formManager = definePageForm(fieldValues);
    formManager.markAsDirty();

    const validationResult = formManager.serialise();

    expect(validationResult.hasErrors).toBe(true);
    expect(validationResult.errorSummary.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages.length).toBe(1);
    expect(validationResult.fields.hexId.errorMessages).toEqual(
      expect.arrayContaining(expectedErrorMessages)
    );
  });
});
