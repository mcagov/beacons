import React from "react";
import { Select, SelectOption } from "../../Select";
import countriesJson from "../../../lib/countries/countries.json";

interface CountrySelectProps {
  id: string;
  name: string;
  defaultValue: string;
}
export const CountrySelect = ({
  id,
  name,
  defaultValue,
}: CountrySelectProps): JSX.Element => (
  <Select
    id={id}
    name={name}
    defaultValue={defaultValue || "Select your country"}
  >
    <option disabled selected value={undefined}>
      Select your country
    </option>
    {countriesJson.map((country: string, index) => (
      <SelectOption key={index} value={country}>
        {country}
      </SelectOption>
    ))}
  </Select>
);
