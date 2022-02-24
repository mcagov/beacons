import {
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { INote } from "entities/INote";
import React, { FunctionComponent } from "react";
import { formatMonth } from "utils/dateTime";
import { titleCase } from "utils/writingStyle";

interface INotesViewingProps {
  notes: INote[];
}

export const noNotesMessage = "No notes associated with this record";

export const NotesViewing: FunctionComponent<INotesViewingProps> = ({
  notes,
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
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{formatMonth(note.createdDate)}</TableCell>
                <TableCell>{titleCase(note.type)}</TableCell>
                <TableCell>{note.text}</TableCell>
                <TableCell>{note.fullName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
