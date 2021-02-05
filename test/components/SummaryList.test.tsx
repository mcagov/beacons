import { render } from "@testing-library/react";
import React from "react";
import { SummaryList } from "../../src/components/SummaryList";

describe("Summary List component", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<SummaryList>Test inner</SummaryList>);
    expect(asFragment()).toMatchSnapshot();
  });
});
