import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import AboutTheVessel, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/emergency-contact";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("EmergencyContact", () => {
  const emptyEmergencyContactForm: FormJSON = {
    hasErrors: false,
    fields: {
      emergencyContact1FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact1TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact1AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact2AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3FullName: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3TelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      emergencyContact3AlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
    },
    errorSummary: [],
  };

  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(<AboutTheVessel form={emptyEmergencyContactForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/beacon-owner-address"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <AboutTheVessel form={emptyEmergencyContactForm} />
    );
    const ownPath = "/register-a-beacon/emergency-contact";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to the check answers page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    expect(handlePageRequest).toHaveBeenCalledWith(
      "/register-a-beacon/check-your-answers",
      expect.anything()
    );
  });
});
