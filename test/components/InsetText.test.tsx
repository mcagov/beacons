import { render } from "@testing-library/react";
import React from "react";
import { InsetText } from "../../src/components/InsetText";

describe("InsetText component", () => {
  describe("Inset Text", () => {
    it("renders correctly", () => {
      const { asFragment } = render(<InsetText>Text in the inset</InsetText>);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
