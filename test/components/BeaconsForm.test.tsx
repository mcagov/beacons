import { render, screen } from "@testing-library/react";
import React from "react";
import { BeaconsForm } from "../../src/components/BeaconsForm";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: { useIndex: 1 },
  })),
}));

describe("BeaconsForm Component", () => {
  let children;
  let previousPageUrl;
  let pageHeading;
  let showCookieBanner;
  let errorMessages;
  let pageText;

  beforeEach(() => {
    children = <h1>Beacons for life</h1>;
    previousPageUrl = "/register-a-beacon/previous-life";
    pageHeading = "A day in the beacon life";
    showCookieBanner = true;
    errorMessages = ["This is an error"];
    pageText = "Once upon a time a person with a beacon walked the seas";
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
        includeUseIndex={true}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      `${previousPageUrl}?useIndex=1`
    );
  });

  it("should render previous page url without the use index query param", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        includeUseIndex={false}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      previousPageUrl
    );
  });

  it("should render the page text if provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        pageText={pageText}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.getByText(pageText)).toBeDefined();
  });

  it("should not render the page text if it is not provided", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.queryByText(pageText)).toBeNull();
  });

  it("should apply govuk-body class to pageText if not already wrapped in a React component", () => {
    render(
      <BeaconsForm
        previousPageUrl={previousPageUrl}
        pageHeading={pageHeading}
        showCookieBanner={showCookieBanner}
        pageText={pageText}
      >
        {children}
      </BeaconsForm>
    );

    expect(screen.queryByText(pageText).classList.contains("govuk-body")).toBe(
      true
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
});
