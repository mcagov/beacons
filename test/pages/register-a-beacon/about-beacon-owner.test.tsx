import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import AboutBeaconOwner, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/about-beacon-owner";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("AboutBeaconOwner", () => {
  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(<AboutBeaconOwner formData={{}} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/more-vessel-details"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <AboutBeaconOwner formData={{}} needsValidation={false} />
    );
    const ownPath = "/register-a-beacon/about-beacon-owner";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to the beacon-owner-address page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    const startURL = "/register-a-beacon/beacon-owner-address";

    expect(handlePageRequest).toHaveBeenCalledWith(startURL);
  });
});
