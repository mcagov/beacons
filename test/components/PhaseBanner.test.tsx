import React from "react";
import { render } from "@testing-library/react";
import PhaseBanner from "../../src/components/PhaseBanner";

describe("PhaseBanner with snapshots", () => {
  it("renders the Phase Banner correctly", () => {
    const { asFragment } = render(
      <PhaseBanner phase="BETA">
        <>
          Hello <a href={"#"}> World </a>
        </>
      </PhaseBanner>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
