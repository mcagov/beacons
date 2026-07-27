import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { INote } from "../../entities/INote";
import { notesFixture } from "../../fixtures/notes.fixture";
import { formatDateLong } from "../../utils/dateTime";
import { noNotesMessage, NotesViewing } from "./NotesViewing";

describe("NotesViewing", () => {
  it("should display the notes of a record", async () => {
    render(<NotesViewing notes={notesFixture as INote[]} />);

    for (const note of notesFixture) {
      expect(
        await screen.findAllByText(formatDateLong(note.createdDate)),
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

  it("calls onEdit with the note when the edit button is clicked", async () => {
    const onEdit = jest.fn();
    render(<NotesViewing notes={notesFixture as INote[]} onEdit={onEdit} />);

    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    expect(onEdit).toHaveBeenCalledWith(notesFixture[0]);
  });

  it("calls onDelete with the note id when the delete button is clicked", async () => {
    const onDelete = jest.fn();
    render(
      <NotesViewing notes={notesFixture as INote[]} onDelete={onDelete} />,
    );

    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    expect(onDelete).toHaveBeenCalledWith(notesFixture[0].id);
  });

  it("does not show edit or delete buttons when callbacks are not provided", async () => {
    render(<NotesViewing notes={notesFixture as INote[]} />);

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });
});
