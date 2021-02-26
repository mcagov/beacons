import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import EmergencyContact, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/emergency-contact";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("EmergencyContact", () => {
  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(
      <EmergencyContact
        formData={{}}
        needsValidation={false}
        showCookieBanner={false}
      />
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/beacon-owner-address"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <EmergencyContact
        formData={{}}
        needsValidation={false}
        showCookieBanner={false}
      />
    );
    const ownPath = "/register-a-beacon/emergency-contact";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to the start page page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    expect(handlePageRequest).toHaveBeenCalledWith("/");
  });
});
