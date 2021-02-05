import { render } from "@testing-library/react";
import React from "react";
import { A } from "../../src/components/Typography";

describe("Typography", () => {
  describe("A", () => {
    it("renders correctly", () => {
      const { asFragment } = render(<A href="#">Link text goes here</A>);
      expect(asFragment()).toMatchSnapshot();
    });

    it("links to the address passed in the href prop", () => {
      const destination = "https://www.madetech.com";

      const { asFragment } = render(<A href={destination}>Made Tech</A>);

      expect(asFragment().querySelector("a").getAttribute("href")).toBe(
        destination
      );
    });

    it("renders with DOM nodes as children", () => {
      const children = (
        <>
          <p>This is some text that needs to be linked from</p>
          <button>And here's a button</button>
        </>
      );

      const { asFragment } = render(<A href="#">{children}</A>);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
