import React from "react";
import Head from "next/head";
import { Layout } from "../../src/components/Layout";
import { render } from "@testing-library/react";

describe("Layout", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <Layout>
        <Body />
      </Layout>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly with the provided breadcrumbs", () => {
    const { asFragment } = render(
      <Layout navigation={<Breadcrumbs />}>
        <Body />
      </Layout>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly with the provided head", () => {
    const { asFragment } = render(
      <Layout head={<Header />}>
        <Body />
      </Layout>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly with the provided breadcrumbs and head", () => {
    const { asFragment } = render(
      <Layout navigation={<Breadcrumbs />} head={<Header />}>
        <Body />
      </Layout>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

const Body = () => <p>Register your beacon</p>;

const Breadcrumbs = () => <h2>Breadcrumbs</h2>;

const Header = () => (
  <Head>
    <title>My Beacon registration</title>
  </Head>
);
