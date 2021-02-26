import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import BeaconOwnerAddressPage, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/beacon-owner-address";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("BeaconOwnerAddressPage", () => {
  it("should have a back button which directs the user to the about beacon owner page", () => {
    render(<BeaconOwnerAddressPage formData={{}} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/about-beacon-owner"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <BeaconOwnerAddressPage formData={{}} needsValidation={false} />
    );
    const ownPath = "/register-a-beacon/beacon-owner-address";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to the start page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    const startURL = "/register-a-beacon/emergency-contact";

    expect(handlePageRequest).toHaveBeenCalledWith(startURL);
  });
});
