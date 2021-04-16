import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import { initBeacon } from "../../../src/lib/registration/registrationInitialisation";
import AboutBeaconOwner, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/about-beacon-owner";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

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
        registration={initBeacon()}
      />
    );
    const ownPath = "";

    const form = container.querySelectorAll("form")[1];

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to the beacon-owner-address page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    const startURL = "/register-a-beacon/beacon-owner-address";

    expect(handlePageRequest).toHaveBeenCalledWith(startURL, expect.anything());
  });
});
