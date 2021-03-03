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

    const form = container.querySelector("form");

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
