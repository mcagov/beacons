import { render } from "@testing-library/react";
import React from "react";
import CookiePage from "../../../src/pages/help/cookies";

describe("Cookies Page", () => {
  it("should render the cookies page", () => {
    render(<CookiePage showCookieBanner={true} />);
  });
});
