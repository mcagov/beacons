/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { acceptRejectCookieId } from "../../src/lib/types";
import ServiceStartPage, { getServerSideProps } from "../../src/pages";

describe("ServiceStartPage", () => {
  it("should have a start now button which directs the user to check your beacon details page", () => {
    render(<ServiceStartPage showCookieBanner={false} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "href",
      "/account/sign-up-or-sign-in"
    );
  });

  describe("getServerSideProps()", () => {
    let context;

    beforeEach(() => {
      context = {
        req: {
          method: "GET",
          cookies: {},
        },
        container: {
          saveDraftRegistration: jest.fn(),
          authenticateUser: jest.fn(),
        },
        res: {
          setHeader: jest.fn(),
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
