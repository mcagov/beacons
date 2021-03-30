import { render } from "@testing-library/react";
import React from "react";
import FourOhFour from "../../src/pages/404";

describe("Custom 404 Page", () => {
  it("should render the page", () => {
    render(<FourOhFour />);
  });
});
