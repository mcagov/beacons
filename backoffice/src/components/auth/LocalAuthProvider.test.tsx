import { render, screen } from "@testing-library/react";
import React from "react";
import { UserRolesView } from "../../views/UserRolesView";
import { LocalAuthProvider } from "./LocalAuthProvider";

describe("LocalAuthProvider", () => {
  it("provides the configured local user to role-gated views", () => {
    render(
      <LocalAuthProvider
        username="dev@beacons.local"
        displayName="Dev User"
        roles={["UPDATE_RECORDS", "ADMIN_EXPORT"]}
        apiAccessToken="local-development-token"
      >
        <UserRolesView />
      </LocalAuthProvider>,
    );

    expect(screen.getByText(/UPDATE_RECORDS/)).toBeVisible();
    expect(screen.getByText(/ADMIN_EXPORT/)).toBeVisible();
  });
});
