import React from "react";
import { render } from "@testing-library/react";
import Aside from "../../src/components/Aside";

describe("Aside", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <Aside title={"Beacons registration"}>
        <MyComponent />
      </Aside>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

const MyComponent = () => <h1>Beacons Registration</h1>;
