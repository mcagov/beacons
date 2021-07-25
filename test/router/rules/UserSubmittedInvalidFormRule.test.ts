import { formSubmissionCookieId } from "../../../src/lib/types";
import {
  mapper,
  validationRules,
} from "../../../src/pages/register-a-beacon/check-beacon-details";
import { UserSubmittedInvalidFormRule } from "../../../src/router/rules/UserSubmittedInvalidFormRule";

describe("UserSubmittedInvalidFormRule", () => {
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
    const rule = new UserSubmittedInvalidFormRule(
      context as any,
      validationRules,
      mapper
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
    const rule = new UserSubmittedInvalidFormRule(
      context as any,
      validationRules,
      mapper
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
      },
    };
    const rule = new UserSubmittedInvalidFormRule(
      context as any,
      validationRules,
      mapper
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
});
