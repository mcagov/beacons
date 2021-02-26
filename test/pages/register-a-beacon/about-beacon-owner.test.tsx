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

  describe("getServerSideProps()", () => {
    it("should return a largely empty props object", async () => {
      const context = {};
      await getServerSideProps(context as GetServerSidePropsContext);

      expect(handlePageRequest).toHaveBeenCalledWith(
        "/register-a-beacon/beacon-owner-address",
        expect.anything()
      );
    });
  });
});
