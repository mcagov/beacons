import { render } from "@testing-library/react";
import React from "react";
import { Button, LinkButton, StartButton } from "../../src/components/Button";

describe("Button components", () => {
  describe("Button", () => {
    it("renders correctly", () => {
      const { asFragment } = render(<Button buttonText="Save and continue" />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Start Button", () => {
    it("renders correctly with the text specified", () => {
      const { asFragment } = render(
        <StartButton buttonText="START NOW" href="#" />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with no button text specified", () => {
      const { asFragment } = render(<StartButton href="#" />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Link Button", () => {
    it("renders correctly with the text specified", () => {
      const { asFragment } = render(
        <LinkButton buttonText="Continue" href="#" />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
