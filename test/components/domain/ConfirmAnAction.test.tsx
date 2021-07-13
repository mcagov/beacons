import { render, screen } from "@testing-library/react";
import React from "react";
import { ConfirmAnAction } from "../../../src/components/domain/ConfirmAnAction";

describe("ConfirmAction", () => {
  it("plays back the action in the header as a question", () => {
    render(
      <ConfirmAnAction
        actionText={"go to Chelsea"}
        redirectUriIfYes={"#"}
        redirectUriIfCancel={"#"}
      />
    );

    expect(
      screen.getByText(/are you sure you want to go to chelsea\?/i)
    ).toBeVisible();
  });

  it("displays the consequences of performing the action if provided", () => {
    const consequencesOfGoingToChelsea =
      "If you go to Chelsea, there will be photographs of fancy tricks";
    render(
      <ConfirmAnAction
        actionText={"go to Chelsea"}
        redirectUriIfYes={"#"}
        redirectUriIfCancel={"#"}
        consequencesText={consequencesOfGoingToChelsea}
      />
    );

    expect(
      screen.getByText(
        "If you go to Chelsea, there will be photographs of fancy tricks"
      )
    ).toBeVisible();
  });

  it("contains a 'Cancel' button allowing the user to back out the action", () => {
    const redirectUriIfCancel = "https://idontwanttogoto.chelsea";
    render(
      <ConfirmAnAction
        actionText="go to Chelsea"
        redirectUriIfYes="#"
        redirectUriIfCancel={redirectUriIfCancel}
      />
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeVisible();
    expect(cancelButton).toHaveAttribute("href", redirectUriIfCancel);
  });

  it("contains a 'Yes' button allowing the user to confirm the action", () => {
    const redirectUriIfYes = "https://www.youtube.com/watch?v=XvRQDsH0Yho";
    render(
      <ConfirmAnAction
        actionText="go to Chelsea"
        redirectUriIfYes={redirectUriIfYes}
        redirectUriIfCancel="#"
      />
    );

    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(yesButton).toBeVisible();
    expect(yesButton).toHaveAttribute("href", redirectUriIfYes);
  });
});
