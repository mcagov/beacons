import { render } from "@testing-library/react";
import React from "react";
import {
  RadioList,
  RadioListItem,
  RadioListItemHint,
} from "../../src/components/RadioList";

describe("Radio List component", () => {
  it("renders correctly with div inside", () => {
    const { asFragment } = render(
      <RadioList>
        <div></div>
      </RadioList>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with radio list item inside", () => {
    const { asFragment } = render(
      <RadioList>
        <RadioListItem
          id="test001"
          name="test001"
          text="test001"
          value="test001"
        />
      </RadioList>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with hint text", () => {
    const { asFragment } = render(
      <RadioList>
        <RadioListItemHint
          id="test001"
          name="test001"
          text="test001"
          value="test001"
          hintText="test001"
        />
      </RadioList>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
