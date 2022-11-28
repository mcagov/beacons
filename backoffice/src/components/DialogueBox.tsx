import { FunctionComponent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DeleteBeaconView } from "views/delete-record/DeleteBeaconView";
import { DialogueType } from "lib/DialogueType";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueType: DialogueType;
  dialogueTitle: string;
  dialogueContentText: string;
  action: string;
  dismissal: string;
  reasonsForAction?: string[] | undefined;
  selectOption: (isActionOption: boolean, reasonForAction: string) => void;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueType,
  dialogueTitle,
  dialogueContentText,
  action,
  dismissal,
  reasonsForAction,
  selectOption,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);
  const [reasonForAction, setReasonForAction] = useState("");
  const [reasonSubmitted, setReasonSubmitted] = useState(false);

  useEffect((): void => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleReasonSubmitted = (reason: string) => {
    setReasonForAction(reason);
    setReasonSubmitted(true);
  };

  const handleCancelled = () => {
    setReasonForAction("");
    setReasonSubmitted(false);
    handleClick(false);
  };

  async function handleClick(isActionOption: boolean): Promise<void> {
    setOpen(false);
    setReasonSubmitted(isActionOption);
    selectOption(isActionOption, reasonForAction);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dialogueType === DialogueType.DeleteBeacon && !reasonSubmitted && (
        <DeleteBeaconView
          reasonsForDeletion={reasonsForAction}
          reasonSubmitted={handleReasonSubmitted}
          cancelled={handleCancelled}
        />
      )}
      {reasonSubmitted && (
        <div>
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
        </div>
      )}
    </Dialog>
  );
};
