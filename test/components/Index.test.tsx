import { render, screen } from "@testing-library/react";
import React from "react";
import { Input } from "../../src/components/Input";

describe("Input", () => {
  let id: string;
  let label: string;

  beforeEach(() => {
    id = "hexId";
    label = "Beacon Hex ID";
  });
  it("should render the input component with the same name", () => {
    render(<Input id={id} label={label} />);

    expect(screen.getByLabelText(label)).toBeDefined();
  });

  it("should render the input component with a different name", () => {});
});
