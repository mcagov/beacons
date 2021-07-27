import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { PageURLs } from "../../../src/lib/urls";
import BeaconOwnerAddressPage from "../../../src/pages/register-a-beacon/beacon-owner-address";

describe("BeaconOwnerAddressPage", () => {
  const emptyBeaconOwnerAddressForm: FormJSON = {
    hasErrors: false,
    fields: {
      ownerAddressLine1: {
        value: "",
        errorMessages: [],
      },
      ownerAddressLine2: {
        value: "",
        errorMessages: [],
      },
      ownerTownOrCity: {
        value: "",
        errorMessages: [],
      },
      ownerCounty: {
        value: "",
        errorMessages: [],
      },
      ownerPostcode: {
        value: "",
        errorMessages: [],
      },
    },
    errorSummary: [],
  };

  it("should have a back button which directs the user to the about beacon owner page", () => {
    render(
      <BeaconOwnerAddressPage
        form={emptyBeaconOwnerAddressForm}
        showCookieBanner={false}
      />
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      expect.stringContaining(PageURLs.aboutBeaconOwner)
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <BeaconOwnerAddressPage
        form={emptyBeaconOwnerAddressForm}
        showCookieBanner={false}
      />
    );

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", "");
  });
});
