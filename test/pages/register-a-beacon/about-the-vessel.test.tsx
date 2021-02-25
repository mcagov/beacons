import { render, screen } from "@testing-library/react";
import React from "react";
import { formSubmissionCookieId } from "../../../src/lib/types";
import AboutTheVessel, {
  getServerSideProps,
} from "../../../src/pages/register-a-beacon/about-the-vessel";

describe("AboutTheVessel", () => {
  it("should have a back button which directs the user to the primary beacon use page", () => {
    render(<AboutTheVessel formData={{}} needsValidation={false} />);

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      "/register-a-beacon/primary-beacon-use"
    );
  });

  describe("getServerSideProps()", () => {
    let context;
    beforeEach(() => {
      context = {
        req: {
          cookies: {
            [formSubmissionCookieId]: "1",
          },
        },
      };
    });

    it("should return an empty props object", async () => {
      const expectedProps = await getServerSideProps(context);
      expect(expectedProps).toStrictEqual({ props: {} });
    });
  });
});
