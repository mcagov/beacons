import { render } from "@testing-library/react";
import React from "react";
import { Panel } from "../../src/components/Panel";

describe("Panel component", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<Panel title="Test" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
