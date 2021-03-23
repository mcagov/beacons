import { render, screen } from "@testing-library/react";
import React from "react";
import { BeaconsForm } from "../../src/components/BeaconsForm";

describe("BeaconsForm Component", () => {
  let children;
  let previousPageUrl;
  let pageHeading;
  let showCookieBanner;
  let formErrors;
  let insetText;

  beforeEach(() => {
    children = <h1>Beacons for life</h1>;
    previousPageUrl = "/register-a-beacon/previous-life";
    pageHeading = "A day in the beacon life";
    showCookieBanner = true;
    formErrors = [];
    insetText = "Once upon a time a person with a beacon walked the seas";
  });

  it("should render the beacons form component", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Beacons for life")).toBeDefined();
  });

  it("should render previous page url", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      previousPageUrl
    );
  });

  it("should render the inset text if provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        insetText={insetText}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText(insetText)).toBeDefined();
  });

  it("should not render the inset text if it is not provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.queryByText(insetText)).toBeNull();
  });
});
