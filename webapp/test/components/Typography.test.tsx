/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";
import { AnchorLink } from "../../src/components/Typography";

describe("Typography Components", () => {
  describe("AnchorLink", () => {
    it("should render a visually hidden span with a description if provided with a description", () => {
      const { getByTestId } = render(
        <AnchorLink href="#" description="Description">
          Text
        </AnchorLink>
      );

      expect(getByTestId("anchor-link-description")).toBeDefined();
    });

    it("should not render a visually hidden span if description not provided", () => {
      const { queryByTestId } = render(<AnchorLink href="#">Text</AnchorLink>);

      expect(queryByTestId("anchor-link-description")).toBeNull();
    });
  });
});
