import { render, screen } from "@testing-library/react";
import React from "react";
import { FormLabel } from "../../src/components/Form";

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
});
