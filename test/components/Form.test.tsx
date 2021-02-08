import React from "react";
import { render } from "@testing-library/react";
import {
  Form,
  FormGroup,
  FormHint,
  FormLabel,
  FormLegend,
  Input,
} from "../../src/components/Form";

describe("Form components", () => {
  it("should render the form component", () => {
    const { asFragment } = render(<Form action="/">Beacons form</Form>);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render a complete form", () => {
    const { asFragment } = render(
      <Form action="/">
        <FormGroup>
          <FormLegend>Select your beacon type</FormLegend>

          <FormLabel htmlFor="id">Beacon type</FormLabel>
          <Input id="beaconType" name="beaconType" />
          <FormHint id="id">Beacon type can be: PLB, EPIRB, or ELT</FormHint>

          <Button />
        </FormGroup>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

const Button = () => <button>submit</button>;
