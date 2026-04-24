import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext, IAuthContext } from "components/auth/AuthProvider";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
import { notesFixture } from "../../fixtures/notes.fixture";
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
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
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
      </AuthContext.Provider>,
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
      </AuthContext.Provider>,
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      await screen.findByText(Placeholders.UnspecifiedError),
    ).toBeVisible();
  });

  it("shows the edit form when the edit button is clicked on a note", async () => {
    notesGateway.getNotes = jest.fn().mockResolvedValue(notesFixture);
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );

    const editButtons = await screen.findAllByRole("button", { name: "Edit" });
    await userEvent.click(editButtons[0]);

    expect(await screen.findByText("Edit note")).toBeVisible();
  });

  it("calls updateNote with the note id when the edit form is saved", async () => {
    notesGateway.getNotes = jest.fn().mockResolvedValue(notesFixture);
    notesGateway.updateNote = jest.fn().mockResolvedValue(notesFixture[0]);
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );

    const editButtons = await screen.findAllByRole("button", { name: "Edit" });
    await userEvent.click(editButtons[0]);
    await userEvent.click(screen.getByTestId("save"));

    await waitFor(() => {
      expect(notesGateway.updateNote).toHaveBeenCalledWith(
        notesFixture[0].id,
        expect.any(Object),
      );
    });
  });

  it("calls deleteNote and removes the note when the delete button is clicked", async () => {
    notesGateway.getNotes = jest.fn().mockResolvedValue(notesFixture);
    notesGateway.deleteNote = jest.fn().mockResolvedValue(undefined);
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );

    const deleteButtons = await screen.findAllByRole("button", {
      name: "Delete",
    });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(notesGateway.deleteNote).toHaveBeenCalledWith(notesFixture[0].id);
      expect(screen.queryByText(notesFixture[0].text)).not.toBeInTheDocument();
    });
  });

  it("displays an error if updateNote fails", async () => {
    notesGateway.getNotes = jest.fn().mockResolvedValue(notesFixture);
    notesGateway.updateNote = jest.fn().mockRejectedValue(new Error());
    jest.spyOn(console, "error").mockImplementation(() => {});
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );

    const editButtons = await screen.findAllByRole("button", { name: "Edit" });
    await userEvent.click(editButtons[0]);
    await userEvent.click(screen.getByTestId("save"));

    expect(await screen.findByRole("alert")).toBeVisible();
  });

  it("displays an error if deleteNote fails", async () => {
    notesGateway.getNotes = jest.fn().mockResolvedValue(notesFixture);
    notesGateway.deleteNote = jest.fn().mockRejectedValue(new Error());
    jest.spyOn(console, "error").mockImplementation(() => {});
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );

    const deleteButtons = await screen.findAllByRole("button", {
      name: "Delete",
    });
    await userEvent.click(deleteButtons[0]);

    expect(await screen.findByRole("alert")).toBeVisible();
  });

  it("fetches notes data on state change", async () => {
    render(
      <AuthContext.Provider value={authContext}>
        <NotesPanel notesGateway={notesGateway} beaconId={beaconId} />
      </AuthContext.Provider>,
    );
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(1);

    const addNoteButton = await screen.findByText(/add a new note/i);
    await userEvent.click(addNoteButton);
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(2);

    const cancelButton = await screen.findByRole("button", {
      name: "Cancel",
    });
    await userEvent.click(cancelButton);
    expect(notesGateway.getNotes).toHaveBeenCalledTimes(3);
  });
});
