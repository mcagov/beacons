import { render } from "@testing-library/react";
import { PhaseBanner } from "../../src/components/PhaseBanner";
import React from "react";
describe("PhaseBanner with snapshots", () => {
  it("renders the Phase Banner correctly", () => {
    const { asFragment } = render(
      <PhaseBanner
        phase={"BETA"}
        bannerHtml={
          <>
            Hello <a href={"#"}> World </a>
          </>
        }
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
