import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteType } from "../../entities/INote";
import { NotesEditing } from "./NotesEditing";

describe("NotesEditing", () => {
  it("allows user to select a note type", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);

    const incidentNoteRadio = screen.getByTestId(/incident-note-type/i);
    userEvent.click(incidentNoteRadio);

    const generalNoteRadio = screen.getByTestId(/general-note-type/i);
    userEvent.click(generalNoteRadio);
  });

  it("user can type a note into text field", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);

    const noteInputField = screen.getByPlaceholderText("Add a note here");
    userEvent.type(noteInputField, "Here is a note");

    expect(await screen.findByDisplayValue("Here is a note")).toBeVisible();
  });

  it("calls the onSave() callback to save the note", async () => {
    const onSave = jest.fn();
    render(<NotesEditing onSave={onSave} onCancel={jest.fn()} />);

    const generalNoteRadio = screen.getByTestId(/general-note-type/i);
    userEvent.click(generalNoteRadio);

    const noteInputField = screen.getByPlaceholderText("Add a note here");
    userEvent.type(noteInputField, "Here is a note");

    await waitFor(() => {
      const saveButton = screen.getByTestId(/save/i);
      userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        type: NoteType.GENERAL,
        text: "Here is a note",
      });
    });
  });

  it("calls the cancel callback to abort", async () => {
    const onCancel = jest.fn();
    render(<NotesEditing onSave={jest.fn()} onCancel={onCancel} />);

    const incidentNoteRadio = screen.getByTestId(/incident-note-type/i);
    userEvent.click(incidentNoteRadio);

    const noteInputField = screen.getByPlaceholderText("Add a note here");
    userEvent.type(noteInputField, "Here is a note");

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it("does not allow user to submit an incomplete note", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });

    const noteInputField = screen.getByPlaceholderText("Add a note here");
    await waitFor(() => {
      userEvent.type(noteInputField, "Here is a note");
    });

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });

    userEvent.clear(noteInputField);

    const generalNoteRadio = screen.getByTestId(/general-note-type/i);
    userEvent.click(generalNoteRadio);

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });
  });
});
