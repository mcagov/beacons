import { formSubmissionCookieId } from "../../../src/lib/types";
import { PageURLs } from "../../../src/lib/urls";
import {
  mapper,
  validationRules,
} from "../../../src/pages/register-a-beacon/check-beacon-details";
import { UserSubmittedValidDraftRegistrationFormRule } from "../../../src/router/rules/UserSubmittedValidDraftRegistrationFormRule";

describe("UserSubmittedValidDraftRegistrationFormRule", () => {
  it("triggers if the form is valid", async () => {
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
    const nextPageUrl = PageURLs.beaconInformation;
    const rule = new UserSubmittedValidDraftRegistrationFormRule(
      context as any,
      validationRules,
      mapper,
      nextPageUrl
    );

    const result = await rule.condition();

    expect(result).toBe(true);
  });

  it("does not trigger if the form is invalid", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // Missing required field
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
    const nextPageUrl = PageURLs.beaconInformation;
    const rule = new UserSubmittedValidDraftRegistrationFormRule(
      context as any,
      validationRules,
      mapper,
      nextPageUrl
    );

    const result = await rule.condition();

    expect(result).toBe(false);
  });

  it("routes to the next page if triggered", async () => {
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
    const nextPageUrl = PageURLs.beaconInformation;
    const rule = new UserSubmittedValidDraftRegistrationFormRule(
      context as any,
      validationRules,
      mapper,
      nextPageUrl
    );

    const result = await rule.action();

    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: PageURLs.beaconInformation,
      },
    });
  });
});
