import { render } from "@testing-library/react";
import React from "react";
import { NotificationBanner } from "../../src/components/NotificationBanner";

describe("Notification Banner component", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <NotificationBanner title="test001">Inner message</NotificationBanner>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
