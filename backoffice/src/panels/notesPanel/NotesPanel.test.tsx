import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
import { Placeholders } from "../../utils/writingStyle";
import { NotesPanel } from "./NotesPanel";

describe("NotesPanel", () => {
  let notesGateway: INotesGateway;
  let beaconId: string;

  beforeEach(() => {
    notesGateway = {
      getNotes: jest.fn().mockResolvedValue([]),
      createNote: jest.fn(),
    };
    beaconId = "12345";
  });

  it("calls the injected NotesGateway", async () => {
    render(<NotesPanel notesGateway={notesGateway} beaconId={beaconId} />);

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
      <NotesPanel notesGateway={notesGateway} beaconId={"does not exist"} />
    );

    expect(await screen.findByRole("alert")).toBeVisible();
    expect(
      await screen.findByText(Placeholders.UnspecifiedError)
    ).toBeVisible();
  });

  it("fetches notes data on state change", async () => {
    render(<NotesPanel notesGateway={notesGateway} beaconId={beaconId} />);
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
