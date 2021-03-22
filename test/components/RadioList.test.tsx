import { render, screen } from "@testing-library/react";
import React from "react";
import { RadioList, RadioListItem } from "../../src/components/RadioList";

describe("RadioList Components", () => {
  describe("RadioListItem", () => {
    let id: string;
    let label: string;
    let hintText: string;

    beforeEach(() => {
      id = "motor-vessel";
      label = "Motor Vessel";
      hintText = "E.g Speedboat, RIB";
    });

    it("should have the correct label for the radio without the hint text", () => {
      render(
        <RadioList>
          <RadioListItem id={id} value="" label={label} />
        </RadioList>
      );
      expect(screen.queryByLabelText(label)).toBeDefined();
      expect(screen.queryByText(hintText)).toBeNull();
    });

    it("should render the hint text for the radio if provided", () => {
      render(
        <RadioList>
          <RadioListItem id={id} value="" label={label} hintText={hintText} />
        </RadioList>
      );
      expect(screen.findByText(hintText)).toBeDefined();
    });

    it("should render the conditional element if the conditional property is set", () => {
      const conditionalText = "Hello Beacons World!";

      render(
        <RadioList conditional={true}>
          <RadioListItem id={id} value="" label={label} conditional={true}>
            {conditionalText}
          </RadioListItem>
        </RadioList>
      );
      expect(screen.getByText(conditionalText)).toBeDefined();
    });

    it("should not render the conditional element if the conditional property is not set", () => {
      const conditionalText = "Hello Beacons World!";

      render(
        <RadioList conditional={false}>
          <RadioListItem id={id} value="" label={label} conditional={false}>
            {conditionalText}
          </RadioListItem>
        </RadioList>
      );
      expect(screen.queryByText(conditionalText)).toBeNull();
    });
  });
});
