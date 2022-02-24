import { render, screen } from "@testing-library/react";
import { INote } from "../../entities/INote";
import { notesFixture } from "../../fixtures/notes.fixture";
import { formatMonth } from "../../utils/dateTime";
import { noNotesMessage, NotesViewing } from "./NotesViewing";

describe("NotesViewing", () => {
  it("should display the notes of a record", async () => {
    render(<NotesViewing notes={notesFixture as INote[]} />);

    for (const note of notesFixture) {
      expect(
        await screen.findAllByText(formatMonth(note.createdDate))
      ).toBeTruthy();
      expect(await screen.findByText(new RegExp(note.type, "i"))).toBeTruthy();
      expect(await screen.findByText(note.text)).toBeTruthy();
      expect(await screen.findAllByText(note.fullName)).toBeTruthy();
    }
  });

  it("displays the noNotesMessage if there are no notes for a record", async () => {
    render(<NotesViewing notes={[]} />);

    expect(await screen.findByText(noNotesMessage)).toBeVisible();
  });
});
