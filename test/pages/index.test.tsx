import React from "react";
import { render, screen } from "@testing-library/react";
import ServiceStartPage from "../../src/pages";

describe("ServiceStartPage", () => {
  it("should have a start now button which directs the user to check your beacon details page", () => {
    render(<ServiceStartPage />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });
});
