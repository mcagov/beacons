import { render, screen } from "@testing-library/react";
import React from "react";
import { Grid } from "../../src/components/Grid";

describe("Grid Components", () => {
  let mainContentText: string;
  let asideText: string;

  beforeEach(() => {
    mainContentText = "Register your beacon!";
    asideText = "Maritime and Coastguard Agency (MCA)";
  });

  it("should render the grid without the aside", () => {
    render(<Grid mainContent={<h1>{mainContentText}</h1>} />);
    expect(screen.getByText(mainContentText)).toBeDefined();
    expect(screen.queryByText(asideText)).toBeNull();
  });

  it("should render the grid with the provided aside", () => {
    render(
      <Grid
        mainContent={<h1>{mainContentText}</h1>}
        aside={<p>{asideText}</p>}
      />
    );
    expect(screen.getByText(mainContentText)).toBeDefined();
    expect(screen.getByText(asideText)).toBeDefined();
  });
});
