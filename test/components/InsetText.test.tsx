import React from "react";
import { render } from "@testing-library/react";
import { InsetText } from "../../src/components/InsetText";

describe("InsetText", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <InsetText>This is an InsetText component</InsetText>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
