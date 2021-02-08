import { render } from "@testing-library/react";
import React from "react";
import { WarningText } from "../../src/components/WarningText";

describe("Warning Text component", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<WarningText text="Test Warning" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
