import React from "react";
import { render, screen } from "@testing-library/react";
import CheckBeaconDetails from "../../../src/pages/register-a-beacon/check-beacon-details";

xdescribe("CheckBeaconDetails", () => {
  it("should have a back button which directs the user to the service start page", () => {
    const formData = {
      manufacturer: "",
      beacon: "",
      hexId: "",
    };
    render(<CheckBeaconDetails formData={formData} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
