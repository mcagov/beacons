import { formSubmissionCookieId } from "../../../src/lib/types";
import {
  mapper,
  validationRules,
} from "../../../src/pages/register-a-beacon/check-beacon-details";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../src/router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { registrationFixture } from "../../fixtures/registration.fixture";

describe("GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors", () => {
  it("triggers if the form is invalid", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // Missing field
    };
    const context = {
      req: {
        method: "POST",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(invalidForm),
        saveDraftRegistration: jest.fn(),
      },
    };
    const rule =
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context as any,
        validationRules,
        mapper,
      );

    const result = await rule.condition();

    expect(result).toBe(true);
  });

  it("does not trigger if the form is valid", async () => {
    const validForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "1D0E9B07CEFFBFF",
    };
    const context = {
      req: {
        method: "POST",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(validForm),
        saveDraftRegistration: jest.fn(),
      },
    };
    const rule =
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context as any,
        validationRules,
        mapper,
      );

    const result = await rule.condition();

    expect(result).toBe(false);
  });

  it("displays errors if triggered", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // Missing field
    };
    const context = {
      req: {
        method: "POST",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(invalidForm),
        saveDraftRegistration: jest.fn(),
        getDraftRegistration: jest.fn(),
      },
    };
    const rule =
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context as any,
        validationRules,
        mapper,
      );

    const result = await rule.action();

    expect(result).toMatchObject({
      props: {
        form: {
          hasErrors: true,
          errorSummary: expect.any(Array),
        },
      },
    });
  });

  it("returns the DraftRegistration", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // Missing field
    };

    const context = {
      req: {
        cookies: {},
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(invalidForm),
        saveDraftRegistration: jest.fn(),
        getDraftRegistration: jest.fn().mockResolvedValue(registrationFixture),
      },
    };

    const rule =
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context as any,
        validationRules,
        mapper,
      );

    const result = await rule.action();

    expect("props" in result).toBe(true);
    if ("props" in result) {
      expect(result.props.draftRegistration).toStrictEqual(registrationFixture);
    }
  });
});
