import React from "react";
import { render, screen } from "@testing-library/react";

import ServiceStartPage from "../../src/pages";

describe("ServiceStartPage", () => {
  it("directs the user to the check your beaecon details page", () => {
    render(<ServiceStartPage />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });
});
