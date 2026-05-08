import { INote } from "../../entities/INote";

export interface INotesGateway {
  getNotes: (beaconId: string) => Promise<INote[]>;
  createNote: (note: Partial<INote>) => Promise<INote>;
  updateNote(noteId: string, note: Partial<INote>): Promise<INote>;
  deleteNote(noteId: string): Promise<void>;
}
