/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { FormGroup, FormLabel } from "../../src/components/Form";

describe("Form Components", () => {
  describe("FormLabel", () => {
    it("should render the label with the correct text", () => {
      const label = "Beacon HexId";
      const id = "hex-id";

      render(
        <>
          <FormLabel htmlFor={id}>{label}</FormLabel>{" "}
          <input id={id} type="text" />
        </>
      );
      expect(screen.getByLabelText(label)).toBeDefined();
    });
  });

  describe("FormGroup", () => {
    let errorMessage;
    let errorMessages: string[];

    beforeEach(() => {
      errorMessage = "A Hex ID should be 15 characters long";
      errorMessages = [errorMessage];
    });

    it("should display the error messages if error messages is not empty", () => {
      render(
        <FormGroup errorMessages={errorMessages}>
          <p>Hello world!</p>
        </FormGroup>
      );
      expect(screen.getByText(errorMessage)).toBeDefined();
    });

    it("should not display the error messages if the error messages are empty", () => {
      render(
        <FormGroup errorMessages={[]}>
          <p>Hello world!</p>
        </FormGroup>
      );
      expect(screen.queryByText(errorMessage)).toBeNull();
    });
  });
});
