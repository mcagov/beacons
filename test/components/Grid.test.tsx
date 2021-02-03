import { render } from "@testing-library/react";
import React from "react";
import { Grid } from "../../src/components/Grid";

describe("Grid", () => {
  it("should render correctly with main content and an side", () => {
    const { asFragment } = render(
      <Grid mainContent={<MainContent />} aside={<Aside />} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly with main content but without an side", () => {
    const { asFragment } = render(<Grid mainContent={<MainContent />} />);

    expect(asFragment()).toMatchSnapshot();
  });
});

const MainContent = () => <h1>Beacons Service</h1>;

const Aside = () => <h2>Register your beacon</h2>;
