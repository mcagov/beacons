import React from "react";
import { render } from "@testing-library/react";
import {
  BreadcrumbList,
  BreadcrumbListItem,
} from "../../src/components/Breadcrumb";

describe("Breadcrumb", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<BreadcrumbList />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the breadcrumb with a NextJS breadcrumb list item", () => {
    const { asFragment } = render(
      <BreadcrumbList>
        <BreadcrumbListItem link="/home">Home</BreadcrumbListItem>
      </BreadcrumbList>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the breadcrumb with a non-NextJS breadcrumb list item", () => {
    const { asFragment } = render(
      <BreadcrumbList>
        <BreadcrumbListItem link="/home" nextJSLink={false}>
          Home
        </BreadcrumbListItem>
      </BreadcrumbList>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
