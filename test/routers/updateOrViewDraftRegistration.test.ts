import { GetServerSidePropsResult } from "next";
import { FieldManager } from "../../src/lib/form/fieldManager";
import { FormManager } from "../../src/lib/form/formManager";
import { Validators } from "../../src/lib/form/validators";
import { formSubmissionCookieId } from "../../src/lib/types";
import { PageURLs } from "../../src/lib/urls";
import { toUpperCase } from "../../src/lib/writingStyle";
import { RegistrationFormMapper } from "../../src/presenters/RegistrationFormMapper";
import { updateOrViewDraftRegistration } from "../../src/routers/updateOrViewDraftRegistration";

describe("updateOrViewDraftRegistration", () => {
  it("routes to next page if user submitted a valid form via POST", async () => {
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

    const result: GetServerSidePropsResult<any> =
      await updateOrViewDraftRegistration(
        context as any,
        formValidationRules,
        formToDraftRegistrationMapper,
        PageURLs.beaconInformation
      );

    expect(result).toStrictEqual({
      redirect: {
        statusCode: 303,
        destination: PageURLs.beaconInformation,
      },
    });
  });

  it("routes to same page with errors if user submitted an invalid form via POST", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // Required field
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

    const result: GetServerSidePropsResult<any> =
      await updateOrViewDraftRegistration(
        context as any,
        formValidationRules,
        formToDraftRegistrationMapper,
        PageURLs.beaconInformation
      );

    const { fields } = result.props.form;
    expect(fields.manufacturer.value).toEqual(invalidForm.manufacturer);
    expect(fields.model.value).toEqual(invalidForm.model);
    expect(fields.hexId.value).toEqual(invalidForm.hexId);
    expect(result.props.form.hasErrors).toEqual(true);
    expect(result.props.form.errorSummary).toHaveLength(1);
  });

  it("routes to same page with no errors if user requested to view the page via GET and DraftRegistration data is valid", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "1D0E9B07CEFFBFF",
    };
    const context = {
      req: {
        method: "GET",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(invalidForm),
        saveDraftRegistration: jest.fn(),
      },
    };

    const result: GetServerSidePropsResult<any> =
      await updateOrViewDraftRegistration(
        context as any,
        formValidationRules,
        formToDraftRegistrationMapper,
        PageURLs.beaconInformation
      );

    const { fields } = result.props.form;
    expect(fields.manufacturer.value).toEqual(invalidForm.manufacturer);
    expect(fields.model.value).toEqual(invalidForm.model);
    expect(fields.hexId.value).toEqual(invalidForm.hexId);
    expect(result.props.form.hasErrors).toEqual(false);
    expect(result.props.form.errorSummary).toHaveLength(0);
  });

  it("routes to same page with no errors if user requested to view the page via GET, even when DraftRegistration data is invalid", async () => {
    const invalidForm = {
      manufacturer: "ACME Inc.",
      model: "Excelsior",
      hexId: "", // missing
    };
    const context = {
      req: {
        method: "GET",
        cookies: {
          [formSubmissionCookieId]: "test-draft-registration-id",
        },
      },
      container: {
        parseFormDataAs: jest.fn().mockResolvedValue(invalidForm),
        saveDraftRegistration: jest.fn(),
      },
    };

    const result: GetServerSidePropsResult<any> =
      await updateOrViewDraftRegistration(
        context as any,
        formValidationRules,
        formToDraftRegistrationMapper,
        PageURLs.beaconInformation
      );

    const { fields } = result.props.form;
    expect(fields.manufacturer.value).toEqual(invalidForm.manufacturer);
    expect(fields.model.value).toEqual(invalidForm.model);
    expect(fields.hexId.value).toEqual(invalidForm.hexId);
    expect(result.props.form.hasErrors).toEqual(false);
    expect(result.props.form.errorSummary).toHaveLength(0);
  });
});

interface CheckBeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
}

const formToDraftRegistrationMapper: RegistrationFormMapper<CheckBeaconDetailsForm> =
  {
    toDraftRegistration: (form) => ({
      manufacturer: form.manufacturer,
      model: form.model,
      hexId: toUpperCase(form.hexId),
    }),
    toForm: (draftRegistration) => ({
      manufacturer: draftRegistration?.manufacturer || "",
      model: draftRegistration?.model || "",
      hexId: draftRegistration?.hexId || "",
    }),
  };

const formValidationRules = ({
  manufacturer,
  model,
  hexId,
}: CheckBeaconDetailsForm): FormManager => {
  return new FormManager({
    manufacturer: new FieldManager(manufacturer, [
      Validators.required("Beacon manufacturer is a required field"),
    ]),
    model: new FieldManager(model, [
      Validators.required("Beacon model is a required field"),
    ]),
    hexId: new FieldManager(hexId, [
      Validators.required("Beacon HEX ID is a required field"),
      Validators.isLength(
        "Beacon HEX ID or UIN must be 15 characters long",
        15
      ),
      Validators.hexadecimalString(
        "Beacon HEX ID or UIN must use numbers 0 to 9 and letters A to F"
      ),
      Validators.ukEncodedBeacon(
        "You entered a beacon encoded with a Hex ID from %HEX_ID_COUNTRY%.  Your beacon must be UK-encoded to use this service."
      ),
      Validators.shouldNotContain(
        'Your HEX ID should not contain the letter "O".  Did you mean the number zero?',
        "O"
      ),
    ]),
  });
};
