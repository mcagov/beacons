import { FunctionComponent, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DeleteBeaconView } from "views/delete-record/DeleteBeaconView";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueTitle: string;
  dialogueContentText: string;
  action: string;
  dismissal: string;
  selectOption: any;
  reasonsForAction?: string[];
  resourceId: string;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueTitle,
  dialogueContentText,
  action,
  dismissal,
  selectOption,
  reasonsForAction,
  resourceId,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);
  const [reasonForAction, setReasonForAction] = useState("");
  const [reasonSubmitted, setReasonSubmitted] = useState(false);

  const isDeleteBeaconDialogue =
    dialogueContentText.includes("beacon") ||
    dialogueContentText.includes("record") ||
    dialogueTitle.includes("record");

  const handleReasonSubmitted = (reason: string) => {
    setReasonForAction(reason);
    setReasonSubmitted(true);
  };

  const handleCancelled = () => {
    handleClick(false);
  };

  async function handleClick(isActionOption: boolean): Promise<void> {
    setOpen(false);
    selectOption(isActionOption, reasonForAction);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {isDeleteBeaconDialogue && !reasonSubmitted && (
        <DeleteBeaconView
          beaconId={resourceId}
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
