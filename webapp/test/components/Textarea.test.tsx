/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { TextareaCharacterCount } from "../../src/components/Textarea";

describe("Textarea Components", () => {
  describe("TextareaCharacterCount", () => {
    let id: string;
    let label: string;
    let hintText: string;
    let maxCharacters: number;

    beforeEach(() => {
      id = "hexId";
      label = "Beacon Hex ID";
      hintText = "Please enter a valid Hex ID";
      maxCharacters = 250;
    });

    it("should not render a label if none is specified", () => {
      render(<TextareaCharacterCount id={id} maxCharacters={maxCharacters} />);
      expect(screen.queryByLabelText(label)).toBeNull();
    });

    it("should render with the correct character count", () => {
      render(
        <TextareaCharacterCount
          id={id}
          label={label}
          maxCharacters={maxCharacters}
        />
      );
      expect(
        screen.getByText(`You can enter up to ${maxCharacters} characters`)
      ).toBeDefined();
    });

    it("should render with the correct label and without the hint text", () => {
      render(
        <TextareaCharacterCount id={id} label={label} maxCharacters={150} />
      );
      expect(screen.getByLabelText(label)).toBeDefined();
      expect(screen.queryByText(hintText)).toBeNull();
    });

    it("should render the hint text if provided", () => {
      render(
        <TextareaCharacterCount
          id={id}
          label={label}
          maxCharacters={150}
          hintText={hintText}
        />
      );
      expect(screen.getByText(hintText)).toBeDefined();
    });

    it("should render the error messages if provided", () => {
      const errorMessage =
        "Where the beacon is positioned must be less than 100 characters";
      render(
        <TextareaCharacterCount
          id={id}
          label={label}
          maxCharacters={100}
          errorMessages={[errorMessage]}
        />
      );
      expect(screen.getByText(errorMessage)).toBeDefined();
    });
  });
});
