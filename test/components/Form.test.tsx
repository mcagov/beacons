import React from "react";
import { render } from "@testing-library/react";
import {
  Form,
  FormGroup,
  FormHint,
  FormLabel,
  FormLegend,
} from "../../src/components/Form";

describe("Form components", () => {
  it("should render the form component", () => {
    const { asFragment } = render(<Form url="/">Beacons form</Form>);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render a complete form", () => {
    const { asFragment } = render(
      <Form url="/">
        <FormGroup>
          <FormLegend>Select your beacon type</FormLegend>

          <FormLabel htmlFor="id">Beacon type</FormLabel>
          <Input id="id" />
          <FormHint id="id">Beacon type can be: PLB, EPIRB, or ELT</FormHint>

          <Button />
        </FormGroup>
      </Form>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

const Input = ({ id }) => (
  <input id={id} aria-describedby={`${id}-hint`} type="text"></input>
);

const Button = () => <button>submit</button>;
