import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FunctionComponent } from "react";

interface IConfirmDialogueProps {
  confirmDialogueModel: IConfirmDialogueModel;
  confirmOption: (actionOptionSelected: boolean) => void;
}

export interface IConfirmDialogueModel {
  dialogueTitle: string;
  dialogueContentText: string;
  action: string;
  dismissal: string;
}

export const ConfirmDialogue: FunctionComponent<IConfirmDialogueProps> = ({
  confirmDialogueModel,
  confirmOption,
}): JSX.Element => {
  function handleClick(isActionOption: boolean): void {
    confirmOption(isActionOption);
  }

  return (
    <div>
      <DialogTitle id="alert-dialog-title">
        {confirmDialogueModel.dialogueTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {confirmDialogueModel.dialogueContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClick(false)}>
          {confirmDialogueModel.dismissal}
        </Button>
        <Button onClick={() => handleClick(true)} autoFocus>
          {confirmDialogueModel.action}
        </Button>
      </DialogActions>
    </div>
  );
};
