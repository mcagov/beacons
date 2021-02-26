import { render } from "@testing-library/react";
import React from "react";
import { acceptRejectCookieId } from "../../src/lib/types";
import FourOhFour, { getServerSideProps } from "../../src/pages/404";

describe("404 Page", () => {
  it("should render the page", () => {
    render(<FourOhFour showCookieBanner={false} />);
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
    it("should set showCookieBanner to true if the user has not accepted the cookie policy", async () => {
      const props = await getServerSideProps(context);
      expect(props).toStrictEqual({
        props: {
          showCookieBanner: true,
        },
      });
    });

    it("should set showCookieBanner to false if the user has accepted the cookie policy", async () => {
      context.req.cookies[acceptRejectCookieId] = "id";
      const props = await getServerSideProps(context);
      expect(props).toStrictEqual({
        props: {
          showCookieBanner: false,
        },
      });
    });
  });
});
