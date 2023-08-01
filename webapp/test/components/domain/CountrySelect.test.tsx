/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CountrySelect } from "../../../src/components/domain/formElements/CountrySelect";
import countriesJson from "../../../src/lib/countries/countries.json";

describe("CountrySelect Component", () => {
  it("renders without errors", () => {
    render(
      <CountrySelect
        id="country"
        name="country"
        defaultValue="United Kingdom"
      />
    );
    const countrySelect = screen.getByRole("combobox");
    expect(countrySelect).toBeInTheDocument();
  });

  it("has the correct default value selected", () => {
    render(
      <CountrySelect
        id="country"
        name="country"
        defaultValue="United Kingdom"
      />
    );
    const countrySelect = screen.getByRole("combobox");
    expect(countrySelect).toHaveValue("United Kingdom");
  });

  it("displays the correct country options", () => {
    render(
      <CountrySelect
        id="country"
        name="country"
        defaultValue="United Kingdom"
      />
    );
    countriesJson.forEach((country) => {
      const countryOption = screen.getByText(country);
      expect(countryOption).toBeInTheDocument();
    });
  });

  it("updates selected value on change", () => {
    render(
      <CountrySelect
        id="country"
        name="country"
        defaultValue="United Kingdom"
      />
    );
    const countrySelect = screen.getByRole("combobox");
    fireEvent.change(countrySelect, { target: { value: "Germany" } });
    expect(countrySelect).toHaveValue("Germany");
  });
});
