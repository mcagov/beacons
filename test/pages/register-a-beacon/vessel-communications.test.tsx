import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import { VesselCommunication } from "../../../src/lib/types";
import VesselCommunications, {
  definePageForm,
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/vessel-communications";
import { expectFormErrors } from "../../lib/form/formManager.test";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("VesselCommunications", () => {
  const emptyVesselCommunicationsForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      callSign: {
        value: "",
        errorMessages: [],
      },
      vhfRadio: {
        value: "",
        errorMessages: [],
      },
      fixedVhfRadio: {
        value: "",
        errorMessages: [],
      },
      fixedVhfRadioInput: {
        value: "",
        errorMessages: [],
      },
      portableVhfRadio: {
        value: "",
        errorMessages: [],
      },
      portableVhfRadioInput: {
        value: "",
        errorMessages: [],
      },
      satelliteTelephone: {
        value: "",
        errorMessages: [],
      },
      satelliteTelephoneInput: {
        value: "",
        errorMessages: [],
      },
      mobileTelephone: {
        value: "",
        errorMessages: [],
      },
      mobileTelephoneInput1: {
        value: "",
        errorMessages: [],
      },
      mobileTelephoneInput2: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the about the vessel page", () => {
    render(<VesselCommunications form={emptyVesselCommunicationsForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/about-the-vessel"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <VesselCommunications form={emptyVesselCommunicationsForm} />
    );
    const ownPath = "/register-a-beacon/vessel-communications";

    const form = container.querySelectorAll("form")[1];

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to more-vessel-details page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    expect(handlePageRequest).toHaveBeenCalledWith(
      "/register-a-beacon/more-vessel-details",
      expect.anything()
    );
  });
});

describe("VesselCommunications form validation", () => {
  const emptyFieldValues = {
    callSign: "",
    fixedVhfRadioInput: "",
    portableVhfRadioInput: "",
    satelliteTelephoneInput: "",
    mobileTelephoneInput1: "",
    mobileTelephoneInput2: "",
  };

  describe("when the Fixed VHF/DSC radio checkbox is selected", () => {
    it("the relevant text input is required", () => {
      const fieldValues = {
        ...emptyFieldValues,
        fixedVhfRadio: VesselCommunication.FIXED_VHF_RADIO,
        fixedVhfRadioInput: "",
      };
      const expectedErrors = [expect.stringContaining("We need your")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(validationResult, expectedErrors, "fixedVhfRadioInput");
    });

    it("the relevant text input should be numbers 0 to 9 only", () => {
      const fieldValues = {
        ...emptyFieldValues,
        fixedVhfRadio: VesselCommunication.FIXED_VHF_RADIO,
        fixedVhfRadioInput: "abcdefghi",
      };
      const expectedErrors = [expect.stringContaining("numbers")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(validationResult, expectedErrors, "fixedVhfRadioInput");
    });

    it("the relevant text input should be exactly nine digits long", () => {
      const fieldValues = {
        ...emptyFieldValues,
        fixedVhfRadio: VesselCommunication.FIXED_VHF_RADIO,
        fixedVhfRadioInput: "0123",
      };
      const expectedErrors = [expect.stringContaining("long")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(validationResult, expectedErrors, "fixedVhfRadioInput");
    });
  });

  describe("when the Portable VHF/DSC radio checkbox is selected", () => {
    it("the relevant text input is required", () => {
      const fieldValues = {
        ...emptyFieldValues,
        portableVhfRadio: VesselCommunication.PORTABLE_VHF_RADIO,
        portableVhfRadioInput: "",
      };
      const expectedErrors = [expect.stringContaining("We need your")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(
        validationResult,
        expectedErrors,
        "portableVhfRadioInput"
      );
    });

    it("the relevant text input should be numbers 0 to 9 only", () => {
      const fieldValues = {
        ...emptyFieldValues,
        portableVhfRadio: VesselCommunication.PORTABLE_VHF_RADIO,
        portableVhfRadioInput: "abcdefghi",
      };
      const expectedErrors = [expect.stringContaining("numbers")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(
        validationResult,
        expectedErrors,
        "portableVhfRadioInput"
      );
    });

    it("the relevant text input should be exactly nine digits long", () => {
      const fieldValues = {
        ...emptyFieldValues,
        portableVhfRadio: VesselCommunication.PORTABLE_VHF_RADIO,
        portableVhfRadioInput: "0123",
      };
      const expectedErrors = [expect.stringContaining("long")];
      const formManager = definePageForm(fieldValues);
      formManager.markAsDirty();

      const validationResult = formManager.serialise();

      expectFormErrors(
        validationResult,
        expectedErrors,
        "portableVhfRadioInput"
      );
    });
  });
});
