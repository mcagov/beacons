import { render, screen } from "@testing-library/react";
import { Placeholders } from "../../utils/writingStyle";
import { FieldValue } from "./FieldValue";

describe("FieldValue", () => {
  it("renders undefined values as the MCA 'NO DATA' placeholder", () => {
    render(<FieldValue>{undefined}</FieldValue>);

    expect(screen.getByText(Placeholders.NoData)).toBeVisible();
  });

  it("renders string values in bold", () => {
    render(<FieldValue>Actual beacon data field</FieldValue>);

    expect(screen.getByText(/Actual beacon data field/i)).toHaveStyle(
      "font-weight: bold"
    );
  });

  it("renders string values in uppercase", () => {
    render(<FieldValue>Sentence case</FieldValue>);

    expect(screen.getByText("SENTENCE CASE")).toBeVisible();
  });
});
