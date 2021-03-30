import { render, screen } from "@testing-library/react";
import React from "react";
import {
  BackButton,
  BackButtonRouterIndexes,
} from "../../src/components/Button";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: { useIndex: 1 },
  })),
}));

describe("Button Components", () => {
  describe("BackButton", () => {
    it("should have the correct text for the back button", () => {
      render(<BackButton href="#" />);
      expect(screen.getByText("Back").textContent).toBeDefined();
    });

    it("should have the correct href attribute", () => {
      render(<BackButton href="#" />);
      expect(screen.getByText("Back")).toHaveAttribute("href", "/#");
    });

    it("should have the correct href attribute if the use index", () => {
      render(<BackButtonRouterIndexes href="#" />);
      expect(screen.getByText("Back")).toHaveAttribute("href", "/#?useIndex=1");
    });
  });
});
