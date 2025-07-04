/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import React from "react";
import { FormJSON } from "../../../src/lib/form/FormManager";
import { GeneralPageURLs } from "../../../src/lib/urls";
import SignUpOrSignIn from "../../../src/pages/account/sign-up-or-sign-in";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    query: { useId: "1" },
  })),
}));

describe("SignUpOrSignIn", () => {
  it("should have a back button which directs the user to the service start page", () => {
    const signUpOrSignInForm: FormJSON = {
      hasErrors: false,
      fields: {
        signUpOrSignIn: {
          value: "",
          errorMessages: [],
        },
      },
      errorSummary: [],
    };

    render(
      <SignUpOrSignIn form={signUpOrSignInForm} showCookieBanner={false} />,
    );

    expect(screen.getByText("Back", { exact: true })).toHaveAttribute(
      "href",
      GeneralPageURLs.start,
    );
  });
});
