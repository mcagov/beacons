import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { OnlyVisibleToUsersWith } from "components/auth/OnlyVisibleToUsersWith";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PanelButton } from "../../components/dataPanel/EditPanelButton";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { DataPanelStates } from "../../components/dataPanel/States";
import { INote } from "../../entities/INote";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
import { logToServer } from "../../utils/logger";
import { Placeholders } from "../../utils/writingStyle";
import { NotesEditing } from "./NotesEditing";
import { NotesViewing } from "./NotesViewing";

interface NotesPanelProps {
  notesGateway: INotesGateway;
  beaconId: string;
}

export const NotesPanel: FunctionComponent<NotesPanelProps> = ({
  notesGateway,
  beaconId,
}: NotesPanelProps): JSX.Element => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [userState, setUserState] = useState<DataPanelStates>(
    DataPanelStates.Viewing,
  );
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchNotes = async (beaconId: string) => {
      try {
        setLoading(true);
        const notes = await notesGateway.getNotes(beaconId);
        setNotes(notes);
        setLoading(false);
      } catch (error) {
        logToServer.error(error);
        setError(true);
      }
    };

    fetchNotes(beaconId);
  }, [userState, beaconId, notesGateway]);

  const handleSave = async (note: Partial<INote>): Promise<void> => {
    try {
      note.beaconId = beaconId;
      await notesGateway.createNote(note);
      setUserState(DataPanelStates.Viewing);
    } catch (error) {
      logToServer.error(error);
      setError(true);
    }
  };

  const handleEditSave = async (note: Partial<INote>): Promise<void> => {
    try {
      note.beaconId = beaconId;
      const updated = await notesGateway.updateNote(editingNote!.id, note);
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
      setEditingNote(null);
    } catch (error) {
      logToServer.error(error);
      setError(true);
    }
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await notesGateway.deleteNote(noteToDelete!);
      setNotes(notes.filter((n) => n.id !== noteToDelete));
      setOpenDeleteDialog(false);
    } catch (error) {
      logToServer.error(error);
      setError(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const renderState = (state: DataPanelStates) => {
    if (editingNote) {
      return (
        <OnlyVisibleToUsersWith role={"ADD_BEACON_NOTES"}>
          <NotesEditing
            title="Edit note"
            initialValues={{
              type: editingNote.type as string,
              text: editingNote.text,
            }}
            onSave={handleEditSave}
            onCancel={() => setEditingNote(null)}
          />
        </OnlyVisibleToUsersWith>
      );
    }

    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <OnlyVisibleToUsersWith role={"ADD_BEACON_NOTES"}>
            <PanelButton onClick={() => setUserState(DataPanelStates.Editing)}>
              Add a new note
            </PanelButton>
            <NotesViewing
              notes={notes}
              onEdit={setEditingNote}
              onDelete={handleDeleteClick}
            />
          </OnlyVisibleToUsersWith>
        );
      case DataPanelStates.Editing:
        return (
          <OnlyVisibleToUsersWith role={"ADD_BEACON_NOTES"}>
            <NotesEditing
              onSave={handleSave}
              onCancel={() => setUserState(DataPanelStates.Viewing)}
            />
          </OnlyVisibleToUsersWith>
        );
      default:
        setError(true);
    }
  };

  return (
    <Card>
      <CardContent>
        <>
          {error && <ErrorState message={Placeholders.UnspecifiedError} />}
          {loading && <LoadingState />}
          {error || loading || renderState(userState)}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCancelDelete}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Box>Are you sure you want to delete this note?</Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCancelDelete}
                color="primary"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color="error"
                variant="outlined"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </CardContent>
    </Card>
  );
};
