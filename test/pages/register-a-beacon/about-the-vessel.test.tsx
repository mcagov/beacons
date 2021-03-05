import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { FormJSON } from "../../../src/lib/form/formManager";
import { handlePageRequest } from "../../../src/lib/handlePageRequest";
import AboutTheVessel, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/about-the-vessel";

jest.mock("../../../src/lib/handlePageRequest", () => ({
  __esModule: true,
  handlePageRequest: jest.fn().mockImplementation(() => jest.fn()),
}));

describe("AboutTheVessel", () => {
  const emptyPrimaryBeaconUseForm: FormJSON = {
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
      homeport: {
        value: "",
        errorMessages: [],
      },
      areaOfOperation: {
        value: "",
        errorMessages: [],
      },
      beaconLocation: {
        value: "",
        errorMessages: [],
      },
    },
  };

  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(<AboutTheVessel form={emptyPrimaryBeaconUseForm} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/primary-beacon-use"
    );
  });

  it("should POST its form submission to itself for redirection via getServerSideProps()", () => {
    const { container } = render(
      <AboutTheVessel form={emptyPrimaryBeaconUseForm} />
    );
    const ownPath = "/register-a-beacon/about-the-vessel";

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("action", ownPath);
  });

  it("should redirect to vessel-communications page on valid form submission", async () => {
    const context = {};
    await getServerSideProps(context as GetServerSidePropsContext);

    expect(handlePageRequest).toHaveBeenCalledWith(
      "/register-a-beacon/vessel-communications",
      expect.anything()
    );
  });
});
