import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext, IAuthContext } from "./AuthProvider";
import { UserMenu } from "./UserMenu";

describe("UserMenu", () => {
  let authContext: IAuthContext;

  beforeEach(() => {
    authContext = {
      user: {
        type: "loggedInUser",
        attributes: {
          username: "steve.stevington@mcga.gov.uk",
          displayName: "Steve Stevington",
          roles: [],
        },
        apiAccessToken: "mockAccessTokenString",
      },
      logout: jest.fn(),
    };
  });

  it("Shows the user's display name on the menu button", () => {
    render(
      <AuthContext.Provider value={authContext}>
        <UserMenu />
      </AuthContext.Provider>,
    );

    expect(
      screen.getByRole("button", { name: "Steve Stevington" }),
    ).toBeVisible();
  });

  it("Displays a logout button when menu is expanded", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <UserMenu />
      </AuthContext.Provider>,
    );
    const expandMenuButton = screen.getByRole("button", {
      name: "Steve Stevington",
    });
    await userEvent.click(expandMenuButton);

    expect(screen.getByText(/logout/i)).toBeVisible();
  });

  it("Calls logout action when user clicks 'logout'", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <UserMenu />
      </AuthContext.Provider>,
    );
    const expandMenuButton = screen.getByRole("button", {
      name: "Steve Stevington",
    });
    await userEvent.click(expandMenuButton);
    const logoutOption = screen.getByText(/logout/i);
    await userEvent.click(logoutOption);

    expect(authContext.logout).toHaveBeenCalled();
  });
});
