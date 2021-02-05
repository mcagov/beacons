import { render } from "@testing-library/react";
import React from "react";
import { Details } from "../../src/components/Details";

describe("Details", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <Details summaryText="Help with nationality">
        We need to know your nationality so we can work out which elections
        you’re entitled to vote in. If you cannot provide your nationality,
        you’ll have to send copies of identity documents through the post.
      </Details>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
