import React from "react";
import { Header } from "../../src/components/Header";
import { render } from "@testing-library/react";

describe("Header", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <Header serviceName={"Beacons Beacons Beacons"} homeLink={"#"} />,
      {}
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
