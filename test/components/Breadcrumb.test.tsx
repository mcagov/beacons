import React from "react";
import { render } from "@testing-library/react";
import {
  BreadcrumbList,
  BreadcrumListItem,
} from "../../src/components/Breadcrumb";

describe("Breadcrumb", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<BreadcrumbList />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the breadcrumb with a NextJS breadcrumb list item", () => {
    const { asFragment } = render(
      <BreadcrumbList>
        <BreadcrumListItem link="/home">Home</BreadcrumListItem>
      </BreadcrumbList>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the breadcrumb with a non-NextJS breadcrumb list item", () => {
    const { asFragment } = render(
      <BreadcrumbList>
        <BreadcrumListItem link="/home" nextJSLink={false}>
          Home
        </BreadcrumListItem>
      </BreadcrumbList>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
