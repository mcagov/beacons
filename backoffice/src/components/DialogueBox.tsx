import { FunctionComponent, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueTitle: string;
  dialogueContentText: string;
  action: string;
  dismissal: string;
  // yuck how do I improve
  selectOption: any;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueTitle,
  dialogueContentText,
  action,
  dismissal,
  selectOption,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);

  function handleClick(isActionOption: boolean): void {
    setOpen(false);
    selectOption(isActionOption);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogueTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogueContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClick(false)}>{dismissal}</Button>
        <Button onClick={() => handleClick(true)} autoFocus>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
