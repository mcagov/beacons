import { render } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { PageURLs } from "../../../src/lib/urls";
import AboutBeaconOwner from "../../../src/pages/register-a-beacon/about-beacon-owner";

describe("AboutBeaconOwner", () => {
  const emptyAboutBeaconOwnerForm: FormJSON = {
    hasErrors: false,
    errorSummary: [],
    fields: {
      ownerFullName: {
        value: "",
        errorMessages: [],
      },
      ownerTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      ownerAlternativeTelephoneNumber: {
        value: "",
        errorMessages: [],
      },
      ownerEmail: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <AboutBeaconOwner
        form={emptyAboutBeaconOwnerForm}
        previousPageUrl={PageURLs.environment}
        showCookieBanner={false}
      />
    );
    const ownPath = "";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });
});
