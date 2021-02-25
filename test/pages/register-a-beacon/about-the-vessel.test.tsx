import { render, screen } from "@testing-library/react";
import React from "react";
import AboutTheVessel from "../../../src/pages/register-a-beacon/about-the-vessel";

describe("AboutTheVessel", () => {
  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(<AboutTheVessel formData={{}} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/primary-beacon-use"
    );
  });
});
