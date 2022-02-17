import { render, screen } from "@testing-library/react";
import { Placeholders } from "../../utils/writingStyle";
import { IField } from "./IField";
import { PanelViewingState } from "./PanelViewingState";

describe("PanelViewingState", () => {
  it("renders empty with no data", () => {
    render(<PanelViewingState fields={[]} />);

    expect(screen.queryByRole("row")).toBeNull();
  });

  it("renders one field", () => {
    const fields: IField[] = [
      {
        key: "Manufacturer",
        value: "Ocean Signal",
      },
    ];

    render(<PanelViewingState fields={fields} />);

    expect(screen.getByText("Manufacturer:")).toBeVisible();
    expect(screen.getByText(/Ocean Signal/i)).toBeVisible();
  });

  it("renders two fields", () => {
    const fields: IField[] = [
      {
        key: "Manufacturer",
        value: "Ocean Signal",
      },
      {
        key: "Model",
        value: "Excelsior EPIRB",
      },
    ];

    render(<PanelViewingState fields={fields} />);

    expect(screen.getByText("Manufacturer:")).toBeVisible();
    expect(screen.getByText(/Ocean Signal/i)).toBeVisible();
    expect(screen.getByText("Model:")).toBeVisible();
    expect(screen.getByText(/Excelsior EPIRB/i)).toBeVisible();
  });

  it("renders undefined fields", () => {
    const fields: IField[] = [
      {
        key: "CHK Code",
        value: undefined,
      },
    ];

    render(<PanelViewingState fields={fields} />);

    expect(screen.getByText("CHK Code:")).toBeVisible();
    expect(screen.getByText(Placeholders.NoData)).toBeVisible();
  });

  it("renders an array of fields for a given key", () => {
    const fields = [
      {
        key: "Address",
        value: ["10 Smith Road", "Bristol", "BS1 97B"],
      },
    ];

    render(<PanelViewingState fields={fields} />);
    expect(screen.getByText(/10 Smith Road/i)).toBeVisible();
    expect(screen.getByText(/Bristol/i)).toBeVisible();
    expect(screen.getByText(/BS1 97B/i)).toBeVisible();
  });

  it("renders an array of values with an undefined value", () => {
    const fields = [
      {
        key: "Address",
        value: ["10 Smith Road", "Bristol", undefined],
      },
    ];

    render(<PanelViewingState fields={fields} />);
    expect(screen.getByText(/10 Smith Road/i)).toBeVisible();
    expect(screen.getByText(/Bristol/i)).toBeVisible();
    expect(screen.getByText(Placeholders.NoData)).toBeVisible();
  });

  it("can split into two even columns", () => {
    const fields: IField[] = [
      {
        key: "Manufacturer",
        value: "Ocean Signal",
      },
      {
        key: "Model",
        value: "Excelsior EPIRB",
      },
      {
        key: "CHK Code",
        value: undefined,
      },
      {
        key: "Type",
        value: "EPIRB",
      },
    ];

    render(<PanelViewingState fields={fields} columns={2} />);

    expect(screen.getAllByRole("table")).toHaveLength(2);
  });

  it("can split into two columns when there are an odd number of fields", () => {
    const fields: IField[] = [
      {
        key: "Manufacturer",
        value: "Ocean Signal",
      },
      {
        key: "Model",
        value: "Excelsior EPIRB",
      },
      {
        key: "CHK Code",
        value: undefined,
      },
      {
        key: "Type",
        value: "EPIRB",
      },
      {
        key: "Hex ID",
        value: "1D0...",
      },
    ];

    render(<PanelViewingState fields={fields} columns={2} />);

    expect(screen.getAllByRole("table")).toHaveLength(2);
  });

  it("can split into two columns on a given index", () => {
    const fields: IField[] = [
      {
        key: "Manufacturer",
        value: "Ocean Signal",
      },
      {
        key: "Model",
        value: "Excelsior EPIRB",
      },
      {
        key: "CHK Code",
        value: undefined,
      },
      {
        key: "Type",
        value: "EPIRB",
      },
      {
        key: "Hex ID",
        value: "1D0...",
      },
    ];

    render(<PanelViewingState fields={fields} columns={2} splitAfter={1} />);

    expect(screen.getAllByRole("table")).toHaveLength(2);
  });
});
