import { render, screen } from "@testing-library/react";
import React from "react";
import {
  BeaconsForm,
  BeaconsFormFieldsetAndLegend,
  BeaconsFormHeading,
  BeaconsFormLabelHeading,
} from "../../src/components/BeaconsForm";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: { useId: 1 },
  })),
}));

describe("BeaconsForm Component", () => {
  let children;
  let previousPageUrl;
  let pageHeading;
  let showCookieBanner;
  let errorMessages;

  beforeEach(() => {
    children = <h1>Beacons for life</h1>;
    previousPageUrl = "/register-a-beacon/previous-life";
    pageHeading = "A day in the beacon life";
    showCookieBanner = true;
    errorMessages = ["This is an error"];
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

  it("should render previous page url with the use index query param", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        includeUseId={true}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      previousPageUrl
    );
  });

  it("should render previous page url without the use index query param", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        includeUseId={false}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      previousPageUrl
    );
  });

  it("should render the error messages if provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        errorMessages={errorMessages}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.queryByText("This is an error")).not.toBeNull();
  });

  it("should not render an error messages if not provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.queryByText("This is an error")).toBeNull();
  });

  it("should render the BeaconsFormFieldsetAndLegend with correct pageHeading and children", () => {
    render(
      <BeaconsFormFieldsetAndLegend pageHeading={pageHeading}>
        <p>lorem</p>
      </BeaconsFormFieldsetAndLegend>
    );
  });

  it("should render the BeaconsFormFieldsetAndLegend with correct pageHeading, children and ariaDescribedBy", () => {
    render(
      <BeaconsFormFieldsetAndLegend
        pageHeading={pageHeading}
        ariaDescribedBy="aria-example"
      >
        <p>lorem</p>
      </BeaconsFormFieldsetAndLegend>
    );
  });

  it("should render the BeaconsFormHeading", () => {
    render(<BeaconsFormHeading pageHeading={pageHeading} />);
  });

  it("should render the FormLabelHeading", () => {
    render(
      <BeaconsFormLabelHeading id="id-example" pageHeading={pageHeading} />
    );
  });
});
