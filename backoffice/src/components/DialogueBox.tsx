import { FunctionComponent, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueContentText: string;
  action: string;
  dismissal: string;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueContentText,
  action,
  dismissal,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);

  const handleClose = () => {
    setOpen(false);
  };

  // emit event up to the parent saying the user's decision

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Are you sure you want to permanently delete this record?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogueContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{dismissal}</Button>
        <Button onClick={handleClose} autoFocus>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
