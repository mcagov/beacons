import { render, screen } from "@testing-library/react";
import React from "react";
import { Input } from "../../src/components/Input";

describe("Input", () => {
  let id: string;
  let label: string;
  let hintText: string;

  beforeEach(() => {
    id = "hexId";
    label = "Beacon Hex ID";
    hintText = "Please enter a value Hex ID";
  });

  it("should render the correct label without the hint text", () => {
    render(<Input id={id} label={label} />);
    expect(screen.getByLabelText(label)).toBeDefined();
    expect(screen.queryByText(hintText)).toBeNull();
  });

  it("should render the hint text if provided", () => {
    render(<Input id={id} label={label} hintText={hintText} />);
    expect(screen.getByText(hintText)).toBeDefined();
  });
});
