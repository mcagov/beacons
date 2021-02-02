import { render } from "@testing-library/react";
import { PhaseBanner } from "../../src/components/PhaseBanner";
import React from "react";
describe("PhaseBanner with snapshots", () => {
  it("renders the Phase Banner correctly", () => {
    const { asFragment } = render(
      <PhaseBanner phase={"BETA"}>
        <>
          Hello <a href={"#"}> World </a>
        </>
      </PhaseBanner>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
