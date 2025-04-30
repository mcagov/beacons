/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { acceptRejectCookieId } from "../lib/types";
import ServiceStartPage, { getServerSideProps } from "./index";

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
          b2CGateway: {
            canConnectToB2C: jest.fn(() => {
              return true;
            }),
          },
        },
        res: {
          setHeader: jest.fn(),
        },
      };
    });

    it("when canConnectToB2C() is true, should return false for showCookieBanner if the cookie is set", async () => {
      context.req.cookies[acceptRejectCookieId] = "id";
      const props = await getServerSideProps(context);

      expect(props).toStrictEqual({
        props: {
          showCookieBanner: false,
        },
      });
    });

    it("when canConnectToB2C() is true, should return true for showCookieBanner if the cookie is not set", async () => {
      const props = await getServerSideProps(context);

      expect(props).toStrictEqual({
        props: {
          showCookieBanner: true,
        },
      });
    });
  });
});
