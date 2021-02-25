import { render } from "@testing-library/react";
import React from "react";
import ApplicationCompletePage from "../../../src/pages/register-a-beacon/application-complete";

describe("ApplicationCompletePage", () => {
  it("should render correctly", () => {
    render(<ApplicationCompletePage />);
  });
});
