import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext, IAuthContext } from "components/auth/AuthProvider";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
import { Placeholders } from "../../utils/writingStyle";
import { NotesPanel } from "./NotesPanel";

jest.mock("../../utils/logger");

describe("NotesPanel", () => {
  let notesGateway: INotesGateway;
  let beaconId: string;
  let authContext: IAuthContext;

  beforeEach(() => {
    notesGateway = {
      getNotes: jest.fn().mockResolvedValue([]),
      createNote: jest.fn(),
    };
    beaconId = "12345";

    authContext = {
      user: {
        type: "loggedInUser",
        attributes: {
          username: "steve.stevington@mcga.gov.uk",
          displayName: "Steve Stevington",
          roles: ["ADD_BEACON_NOTES"],
        },
        apiAccessToken: "mockAccessTokenString",
      },
      logout: jest.fn(),
    };
  });

  it("calls the injected NotesGateway", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(notesGateway.getNotes).toHaveBeenCalled();
    });
  });

  it("displays an error if notes lookup fails for any reason", async () => {
    notesGateway.getNotes = jest.fn().mockImplementation(() => {
      throw Error();
    });
    jest.spyOn(console, "error").mockImplementation(() => {}); // Avoid console error failing test
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={"does not exist"} />
      </AuthContext.Provider>
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      await screen.findByText(Placeholders.UnspecifiedError)
    ).toBeVisible();
  });

  it("fetches notes data on state change", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>
    );
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(1);

    const addNoteButton = await screen.findByText(/add a new note/i);
    userEvent.click(addNoteButton);
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(2);

    const cancelButton = await screen.findByRole("button", {
      name: "Cancel",
    });
    userEvent.click(cancelButton);
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(3);
  });
});
