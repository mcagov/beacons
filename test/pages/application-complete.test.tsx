import React from "react";
import { render } from "@testing-library/react";
import ApplicationCompletePage from "../../src/pages/application-complete";

describe("Intent Page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<ApplicationCompletePage />, {});

    expect(asFragment()).toMatchSnapshot();
  });
});
