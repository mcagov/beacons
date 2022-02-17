/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";
import Custom500 from "../../src/pages/500";

describe("Custom 500 page", () => {
  it("should render the page", () => {
    render(<Custom500 />);
  });
});
