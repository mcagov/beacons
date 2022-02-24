import { Card, CardContent } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PanelButton } from "../../components/dataPanel/EditPanelButton";
import { ErrorState } from "../../components/dataPanel/PanelErrorState";
import { LoadingState } from "../../components/dataPanel/PanelLoadingState";
import { DataPanelStates } from "../../components/dataPanel/States";
import { INote } from "../../entities/INote";
import { INotesGateway } from "../../gateways/notes/INotesGateway";
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
    DataPanelStates.Viewing
  );
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
        console.error(error);
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
      console.error(error);
      setError(true);
    }
  };

  const renderState = (state: DataPanelStates) => {
    switch (state) {
      case DataPanelStates.Viewing:
        return (
          <>
            <PanelButton onClick={() => setUserState(DataPanelStates.Editing)}>
              Add a new note
            </PanelButton>
            <NotesViewing notes={notes} />
          </>
        );
      case DataPanelStates.Editing:
        return (
          <NotesEditing
            onSave={handleSave}
            onCancel={() => setUserState(DataPanelStates.Viewing)}
          />
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
        </>
      </CardContent>
    </Card>
  );
};
