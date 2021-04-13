import { render, screen } from "@testing-library/react";
import React from "react";
import { acceptRejectCookieId } from "../../src/lib/types";
import ServiceStartPage, { getServerSideProps } from "../../src/pages";

jest.mock("../../src/lib/middleware", () => {
  return {
    __esModule: true,
    setFormSubmissionCookie: jest.fn(),
  };
});
jest.mock("../../src/gateways/basicAuthGateway");

describe("ServiceStartPage", () => {
  it("should have a start now button which directs the user to check your beacon details page", () => {
    render(<ServiceStartPage showCookieBanner={false} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "href",
      "/register-a-beacon/check-beacon-details"
    );
  });

  describe("getServerSideProps()", () => {
    let context;

    beforeEach(() => {
      context = {
        req: {
          cookies: {},
        },
      };
    });

    it("should return false for showCookieBanner if the cookie is set", async () => {
      context.req.cookies[acceptRejectCookieId] = "id";
      const props = await getServerSideProps(context);

      expect(props).toStrictEqual({
        props: {
          showCookieBanner: false,
        },
      });
    });

    it("should return true for showCookieBanner if the cookie is not set", async () => {
      const props = await getServerSideProps(context);

      expect(props).toStrictEqual({
        props: {
          showCookieBanner: true,
        },
      });
    });
  });
});
