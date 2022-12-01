import { FunctionComponent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { DeleteBeaconView } from "views/delete-record/DeleteBeaconView";
import { DialogueType } from "lib/DialogueType";
import { ConfirmDialogue, IConfirmDialogueModel } from "./ConfirmDialogue";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueType: DialogueType;
  reasonsForAction?: string[] | undefined;
  confirmDialogueModel: IConfirmDialogueModel;
  selectOption: (isActionOption: boolean, reasonForAction: string) => void;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueType,
  reasonsForAction,
  confirmDialogueModel,
  selectOption,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);
  const [reasonForAction, setReasonForAction] = useState("");
  const [reasonSubmitted, setReasonSubmitted] = useState(false);
  const [showReasonDialogue, setShowReasonDialogue] = useState(true);

  useEffect((): void => {
    setOpen(isOpen);
    setShowReasonDialogue(true);
  }, [isOpen]);

  useEffect((): void => {
    setShowReasonDialogue(false);
  }, [reasonSubmitted]);

  const handleReasonSubmitted = (reason: string) => {
    setReasonForAction(reason);
    setReasonSubmitted(true);
  };

  const handleCancelled = () => {
    handleConfirmOption(false);
    resetReasonDialogue();
  };

  function handleConfirmOption(isActionOption: boolean): void {
    setOpen(false);
    resetReasonDialogue();
    selectOption(isActionOption, reasonForAction);
  }

  function resetReasonDialogue(): void {
    setReasonForAction("");
    setReasonSubmitted(false);
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {dialogueType === DialogueType.DeleteBeacon && showReasonDialogue && (
        <DeleteBeaconView
          reasonsForDeletion={reasonsForAction}
          reasonSubmitted={handleReasonSubmitted}
          cancelled={handleCancelled}
        />
      )}
      {confirmDialogueModel && reasonSubmitted && (
        <ConfirmDialogue
          confirmDialogueModel={confirmDialogueModel}
          confirmOption={handleConfirmOption}
        />
      )}
    </Dialog>
  );
};
