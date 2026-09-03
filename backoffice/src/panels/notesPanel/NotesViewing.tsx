import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { INote } from "entities/INote";
import React, { FunctionComponent } from "react";
import { formatDateLong } from "utils/dateTime";
import { titleCase } from "utils/writingStyle";

interface INotesViewingProps {
  notes: INote[];
  onEdit?: (note: INote) => void;
  onDelete?: (noteId: string) => void;
}

export const noNotesMessage = "No notes associated with this record";

export const NotesViewing: FunctionComponent<INotesViewingProps> = ({
  notes,
  onEdit,
  onDelete,
}: INotesViewingProps): JSX.Element => {
  if (notes.length === 0) {
    return <CardHeader title={noNotesMessage} />;
  }

  return (
    <>
      <CardHeader title="MCA / MCC Notes" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type of note</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Noted by</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{formatDateLong(note.createdDate)}</TableCell>
                <TableCell>{titleCase(note.type)}</TableCell>
                <TableCell>{note.text}</TableCell>
                <TableCell>{note.fullName}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {onEdit && (
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<EditIcon />}
                        onClick={() => onEdit(note)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        endIcon={<DeleteIcon />}
                        onClick={() => onDelete(note.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
