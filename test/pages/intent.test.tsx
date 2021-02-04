import React from "react";
import { render } from "@testing-library/react";
import IntentPage from "../../src/pages/intent";

describe("Intent Page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<IntentPage />, {});

    expect(asFragment()).toMatchSnapshot();
  });
});
