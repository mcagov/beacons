/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { CheckboxList, CheckboxListItem } from "../../src/components/Checkbox";

describe("Checkbox Components", () => {
  describe("CheckboxListItem", () => {
    let id: string;
    let label: string;
    let hintText: string;

    beforeEach(() => {
      id = "mobile-number";
      label = "Enter your mobile number";
      hintText = "UK mobile numbers start with (+44)";
    });

    it("should have the correct label for the checkbox without the hint text", () => {
      render(
        <CheckboxList>
          <CheckboxListItem id={id} value="" label={label} />
        </CheckboxList>
      );
      expect(screen.getByLabelText(label)).toBeDefined();
      expect(screen.queryByText(hintText)).toBeNull();
    });

    it("should render the hint text for the checkbox if provided", () => {
      render(
        <CheckboxList>
          <CheckboxListItem
            id={id}
            value=""
            label={label}
            hintText={hintText}
          />
        </CheckboxList>
      );
      expect(screen.getByText(hintText)).toBeDefined();
    });

    it("should render the conditional element if the conditional property is set", () => {
      const conditionalText = "Hello Beacons World!";

      render(
        <CheckboxList>
          <CheckboxListItem id={id} value="" label={label} conditional={true}>
            {conditionalText}
          </CheckboxListItem>
        </CheckboxList>
      );
      expect(screen.getByText(conditionalText)).toBeDefined();
    });

    it("should not render the conditional element if the conditional property is not set", () => {
      const conditionalText = "Hello Beacons World!";

      render(
        <CheckboxList>
          <CheckboxListItem id={id} value="" label={label}>
            {conditionalText}
          </CheckboxListItem>
        </CheckboxList>
      );
      expect(screen.queryByText(conditionalText)).toBeNull();
    });
  });
});
