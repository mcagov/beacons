import { render } from "@testing-library/react";
import Home from "../../src/pages/index";

describe("Home Page", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<Home />, {});

    expect(asFragment()).toMatchSnapshot();
  });
});
