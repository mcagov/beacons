import { formSubmissionCookieId } from "../../../src/lib/types";
import {
  mapper,
  validationRules,
} from "../../../src/pages/register-a-beacon/check-beacon-details";
import { IfUserViewedFormRule } from "../../../src/router/rules/IfUserViewedFormRule";

describe("IfUserViewedFormRule", () => {
  it("triggers if the request is a GET request", async () => {
    const context = {
      req: {
        method: "GET",
      },
    };
    const rule = new IfUserViewedFormRule(
      context as any,
      validationRules,
      mapper
    );

    const result = await rule.condition();

    expect(result).toBe(true);
  });

  it("does not trigger if the request is not a GET request", async () => {
    const context = {
      req: {
        method: "POST",
      },
    };
    const rule = new IfUserViewedFormRule(
      context as any,
      validationRules,
      mapper
    );

    const result = await rule.condition();

    expect(result).toBe(false);
  });

  /**
   * In cases where the user is viewing or editing an existing registration, the
   * page should not display errors.  This allows for the editing draft
   * registration flow to be used by account holders to update legacy beacon
   * data or a registration made before a validation rule changed.
   *
   * The form should still prevent the user from pressing 'Continue' until the
   * current validation rules have been satisfied, though this is covered in
   * another rule.
   */
  it("displays the page without errors if triggered", async () => {
    const context = {
      req: {
        method: "GET",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        getDraftRegistration: jest.fn().mockResolvedValue({
          manufacturer: "ACME Inc.",
          model: "Excelsior",
          hexId: "", // Missing value, but errors not shown.
        }),
      },
    };
    const rule = new IfUserViewedFormRule(
      context as any,
      validationRules,
      mapper
    );

    const result = (await rule.action()) as any;

    expect(result.props.form.hasErrors).toBe(false);
    expect(result.props.form.errorSummary).toHaveLength(0);
  });
});
