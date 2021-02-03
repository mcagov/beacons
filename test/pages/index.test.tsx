import React from "react";
import { render } from "@testing-library/react";
import ServiceStartPage from "../../src/pages/index";

describe("Home Page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<ServiceStartPage />, {});

    expect(asFragment()).toMatchSnapshot();
  });
});
