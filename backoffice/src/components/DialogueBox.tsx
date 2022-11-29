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

  useEffect((): void => {
    setOpen(isOpen);
    setReasonSubmitted(reasonSubmitted);
  }, [isOpen, reasonSubmitted]);

  const handleReasonSubmitted = (reason: string) => {
    setReasonForAction(reason);
    setReasonSubmitted(true);
  };

  const handleCancelled = () => {
    console.log("cancelled");
    cancelReasonDialogue();
    handleConfirmOption(false);
  };

  function handleConfirmOption(isActionOption: boolean): void {
    setOpen(false);
    setReasonSubmitted(isActionOption);
    if (!isActionOption) {
      cancelReasonDialogue();
    }
    selectOption(isActionOption, reasonForAction);
  }

  function cancelReasonDialogue(): void {
    setReasonForAction("");
    setReasonSubmitted(false);
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
      {confirmDialogueModel && reasonSubmitted && (
        <ConfirmDialogue
          confirmDialogueModel={confirmDialogueModel}
          confirmOption={handleConfirmOption}
        />
      )}
    </Dialog>
  );
};
