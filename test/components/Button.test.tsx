import { render, screen } from "@testing-library/react";
import React from "react";
import { BackButton } from "../../src/components/Button";

describe("Button Components", () => {
  describe("BackButton", () => {
    it("should have the correct text for the back button", () => {
      render(<BackButton href="#" />);
      expect(screen.getByText("Back").textContent).toBeDefined();
    });

    it("should have the correct href attribute", () => {
      render(<BackButton href="#" />);
      expect(screen.getByText("Back")).toHaveAttribute("href", "#");
    });
  });
});
