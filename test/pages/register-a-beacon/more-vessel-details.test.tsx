import { render, screen } from "@testing-library/react";
import React from "react";
import MoreVesselDetails from "../../../src/pages/register-a-beacon/more-vessel-details";

describe("MoreVesselDetails page", () => {
  it("should have a back button which directs the user to the previous form page", () => {
    render(<MoreVesselDetails formData={{}} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/vessel-communications"
    );
  });
});
