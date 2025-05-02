/**
 * @jest-environment jsdom
 */

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

  const MainContent = () => <h1>{mainContentText}</h1>;
  const Aside = () => <p>{asideText}</p>;

  it("should render the grid without the aside", () => {
    render(<Grid mainContent={<MainContent />} />);
    expect(screen.getByText(mainContentText)).toBeDefined();
    expect(screen.queryByText(asideText)).toBeNull();
  });

  it("should render the grid with the provided aside", () => {
    render(<Grid mainContent={<MainContent />} aside={<Aside />} />);
    expect(screen.getByText(mainContentText)).toBeDefined();
    expect(screen.getByText(asideText)).toBeDefined();
  });
});
