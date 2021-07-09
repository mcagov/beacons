import { render, screen } from "@testing-library/react";
import React from "react";
import { BeaconUseSection } from "../../../src/components/domain/BeaconUseSection";
import { BeaconUse, Environment } from "../../../src/lib/registration/types";
import { getMockUse } from "../../mocks";

describe("BeaconUseSection", () => {
  it("displays the environment in the header", () => {
    const use: BeaconUse = getMockUse();

    render(<BeaconUseSection use={use} index={1} />);

    expect(
      screen.getByText(Environment.MARITIME, { exact: false })
    ).toBeVisible();
  });
});
