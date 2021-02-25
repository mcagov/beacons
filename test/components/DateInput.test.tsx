import { render, screen } from "@testing-library/react";
import React from "react";
import { DateListInput } from "../../src/components/DateInput";

describe("Date Input Components", () => {
  describe("DateListInput", () => {
    let hintText;

    beforeEach(() => {
      hintText = "You only need to enter the month";
    });

    it("should render the hint text if provided", () => {
      render(
        <DateListInput id="1" label="Enter the month" hintText={hintText}>
          Enter month
        </DateListInput>
      );
      expect(screen.getByText(hintText)).toBeDefined();
    });

    it("should not render the hint text if not provided", () => {
      render(
        <DateListInput id="1" label="Enter the month">
          Enter month
        </DateListInput>
      );
      expect(screen.queryByText(hintText)).toBeNull();
    });
  });
});
