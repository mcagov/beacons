import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeServer } from "server";
import {
  iClickButtonFoundByTestId,
  iClickButtonFoundByText,
  iShouldSeeText,
} from "utils/integrationTestSelectors";
import { v4 } from "uuid";
import { INote } from "../../entities/INote";
import { notesFixture } from "../../fixtures/notes.fixture";
import { IAuthGateway } from "../../gateways/auth/IAuthGateway";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
import { NotesGateway } from "../../gateways/notes/NotesGateway";
import { NotesPanel } from "./NotesPanel";
import { noNotesMessage } from "./NotesViewing";

describe("NotesPanel", () => {
  let authGateway: IAuthGateway;
  let gateway: INotesGateway;
  let beaconId: string;

  let server: any;

  beforeAll(() => {
    server = makeServer({ environment: "test" });
    authGateway = {
      getAccessToken: jest.fn().mockResolvedValue("Test access token"),
    };
    gateway = new NotesGateway(authGateway);
    beaconId = v4();
  });

  afterAll(() => {
    server.shutdown();
  });

  it("notes integration test", async () => {
    whenThereAreNoNotesForARecord();
    iShouldSeeText(noNotesMessage);

    whenIAddAGeneralNote(notesFixture[0].text);
    iShouldSeeText("MCA / MCC Notes");
    iShouldSeeMyNote(notesFixture[0]);

    whenIAddAnIncidentNote(notesFixture[1].text);
    iShouldSeeMyNote(notesFixture[1]);
  });

  const whenThereAreNoNotesForARecord = () => {
    render(<NotesPanel notesGateway={gateway} beaconId={beaconId} />);
  };

  const iTypeMyNote = async (noteText: string) => {
    const noteInputField = await screen.findByPlaceholderText(
      "Add a note here"
    );
    userEvent.type(noteInputField, noteText);
  };

  const whenIAddAGeneralNote = (noteText: string) => {
    iClickButtonFoundByText(/add a new note/i);
    iClickButtonFoundByTestId(/general-note-type/i);
    iTypeMyNote(noteText);
    iClickButtonFoundByTestId(/save/i);
  };

  const whenIAddAnIncidentNote = (noteText: string) => {
    iClickButtonFoundByText(/add a new note/i);
    iClickButtonFoundByTestId(/incident-note-type/i);
    iTypeMyNote(noteText);
    iClickButtonFoundByTestId(/save/i);
  };

  const iShouldSeeMyNote = (note: INote) => {
    iShouldSeeText(note.createdDate);
    iShouldSeeText(note.type);
    iShouldSeeText(note.text);
    iShouldSeeText(note.fullName);
  };
});
