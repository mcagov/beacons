import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import AboutTheVessel from "../../../src/pages/register-a-beacon/about-the-vessel";

describe("AboutTheVessel", () => {
  const aboutTheVesselForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      maxCapacity: {
        value: "",
        errorMessages: [],
      },
      vesselName: {
        value: "",
        errorMessages: [],
      },
      beaconLocation: {
        value: "",
        errorMessages: [],
      },
      portLetterNumber: {
        value: "",
        errorMessages: [],
      },
      homeport: {
        value: "",
        errorMessages: [],
      },
      areaOfOperation: {
        value: "",
        errorMessages: [],
      },
      imoNumber: {
        value: "",
        errorMessages: [],
      },
      ssrNumber: {
        value: "",
        errorMessages: [],
      },
      rssNumber: {
        value: "",
        errorMessages: [],
      },
      officialNumber: {
        value: "",
        errorMessages: [],
      },
      rigPlatformLocation: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the about the vessel page", () => {
    render(<AboutTheVessel form={aboutTheVesselForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/activity?useIndex=0"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(<AboutTheVessel form={aboutTheVesselForm} />);

    const form = container.querySelectorAll("form")[1];

    expect(form).toHaveAttribute("action", "");
  });
});
