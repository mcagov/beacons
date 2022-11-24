import { FunctionComponent, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DeleteBeaconView } from "views/DeleteBeaconView";
import { IBeaconsGateway } from "gateways/beacons/IBeaconsGateway";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";

interface IDialogueBoxProps {
  isOpen: boolean;
  dialogueTitle: string;
  dialogueContentText: string;
  action: string;
  dismissal: string;
  // yuck how do I improve
  selectOption: any;
  reasonsForAction?: string[];
  resourceId: string;
  gateway: IBeaconsGateway | IAccountHolderGateway;
}

export const DialogueBox: FunctionComponent<IDialogueBoxProps> = ({
  isOpen,
  dialogueTitle,
  dialogueContentText,
  // e.g delete beacon
  action,
  dismissal,
  selectOption,
  reasonsForAction,
  resourceId,
  gateway,
}): JSX.Element => {
  const [open, setOpen] = useState(isOpen);
  const isDeleteBeaconDialogue =
    dialogueContentText.includes("beacon") ||
    dialogueContentText.includes("record") ||
    dialogueTitle.includes("record");

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
      {isDeleteBeaconDialogue && (
        <DeleteBeaconView
          beaconId={resourceId}
          beaconsGateway={gateway as IBeaconsGateway}
          // listen for the submit form event
        />
      )}
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
