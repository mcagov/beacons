import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import VesselCommunications, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/vessel-communications";

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

  it("should redirect to more-details page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    expect(handlePageRequest).toHaveBeenCalledWith(
      "/register-a-beacon/more-details",
      expect.anything()
    );
  });

  it("should have an autocomplete attribute on the mobile telephone number field", () => {
    const { container } = render(
      <VesselCommunications form={emptyVesselCommunicationsForm} />
    );

    const mobilePhoneInput1 = container.querySelector("#mobileTelephoneInput1");
    const mobilePhoneInput2 = container.querySelector("#mobileTelephoneInput2");

    expect(mobilePhoneInput1).toHaveAttribute("autocomplete", "tel");
    expect(mobilePhoneInput2).toHaveAttribute("autocomplete", "tel");
  });

  it("should not have an autocomplete attribute on the satellite telephone number field", () => {
    // Because this is likely to result in users' mobile and other more commonly used
    // numbers being autocompleted into the satellite number field.  We don't want this.
    const { container } = render(
      <VesselCommunications form={emptyVesselCommunicationsForm} />
    );

    const satelliteTelephoneNumberInput = container.querySelector(
      "#satelliteTelephoneInput"
    );

    expect(satelliteTelephoneNumberInput).not.toHaveAttribute("autocomplete");
  });
});
