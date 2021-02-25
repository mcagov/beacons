import { render, screen } from "@testing-library/react";
import React from "react";
import VesselCommunications from "../../../src/pages/register-a-beacon/vessel-communications";

describe("VesselCommunications", () => {
  it("should have a back button which directs the user to the about the vessel page", () => {
    render(<VesselCommunications formData={{}} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/about-the-vessel"
    );
  });
});
