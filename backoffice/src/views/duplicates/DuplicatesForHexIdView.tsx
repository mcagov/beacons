import React, { FunctionComponent, useEffect, useState } from "react";
import { IDuplicatesGateway } from "../../gateways/duplicates/IDuplicatesGateway";
import { IDuplicateSummary } from "../../gateways/duplicates/IDuplicatesSummaryDTO";
import { DuplicatesTable } from "../../components/duplicates/DuplicatesTables";
import { IDuplicateBeacon } from "../../entities/IDuplicateBeacon";
import { BeaconSummaryPanel } from "../../panels/beaconSummaryPanel/BeaconSummaryPanel";
import { IBeaconsGateway } from "../../gateways/beacons/IBeaconsGateway";
import { PageHeader } from "../../components/layout/PageHeader";
import { BeaconStatuses } from "../../entities/IBeacon";
import { OnlyVisibleToUsersWith } from "../../components/auth/OnlyVisibleToUsersWith";
import { SingleBeaconExportButtons } from "../exports/SingleBeaconExportButtons";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";
import { DialogueBox } from "../../components/DialogueBox";
import { DialogueType } from "../../lib/DialogueType";
import { reasonsForDeletion } from "../../lib/BeaconDeletionReasons";
import { IConfirmDialogueModel } from "../../components/ConfirmDialogue";
import { IDeleteBeaconDto } from "../../entities/IDeleteBeaconDto";
import { useHistory } from "react-router-dom";
import { IUsesGateway } from "../../gateways/uses/IUsesGateway";
import { UsesListPanel } from "../../panels/usesPanel/UsesListPanel";
import { PageContent } from "../../components/layout/PageContent";

interface IDuplicatesForHexIdViewProps {
  hexId: string;
  duplicatesGateway: IDuplicatesGateway;
  beaconsGateway: IBeaconsGateway;
  usesGateway: IUsesGateway;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);
export const DuplicatesForHexIdView: FunctionComponent<
  IDuplicatesForHexIdViewProps
> = ({ hexId, duplicatesGateway, beaconsGateway, usesGateway }) => {
  const classes = useStyles();
  const routerHistory = useHistory();
  const [duplicates, setDuplicates] = useState<IDuplicateBeacon[]>([]);
  const [dialogueIsOpen, setDialogueIsOpen] = useState<boolean>(false);
  const [currentBeaconId, setCurrentBeaconId] = useState<string>("");

  useEffect((): void => {
    const getDuplicates = async () => {
      const duplicatesForHexId = await duplicatesGateway.getDuplicatesForHexId(
        hexId
      );
      setDuplicates(duplicatesForHexId);
    };

    getDuplicates();
  }, [duplicatesGateway]);

  const openDialogueBox = () => {
    setDialogueIsOpen(true);
  };

  const modernConfirmDialogueModel: IConfirmDialogueModel = {
    dialogueTitle: "Are you sure you want to permanently delete this record?",
    dialogueContentText:
      "This will delete the beacon record, its owner(s), and all other associated information.",
    action: "Yes",
    dismissal: "No",
  };

  const handleDeleteDialogueAction = async (
    actionOptionSelected: boolean,
    reasonForAction: string
  ) => {
    setDialogueIsOpen(false);
    if (actionOptionSelected) {
      const deleteBeaconDto: IDeleteBeaconDto = {
        beaconId: currentBeaconId,
        reason: reasonForAction,
      };
      await beaconsGateway.deleteBeacon(deleteBeaconDto);
      routerHistory.goBack();
    }
  };

  const summaries = duplicates.map((summary) => {
    return (
      <p>
        {summary.status !== BeaconStatuses.Deleted && (
          <span>
            <OnlyVisibleToUsersWith role={"ADMIN_EXPORT"}>
              <SingleBeaconExportButtons
                beaconId={summary.beaconId}
                buttonClasses={classes.button}
              />
            </OnlyVisibleToUsersWith>
            <OnlyVisibleToUsersWith role={"DELETE_BEACONS"}>
              <span className={classes.button}>
                <Button
                  onClick={() => {
                    openDialogueBox();
                    setCurrentBeaconId(summary.beaconId);
                  }}
                  variant="outlined"
                  color="error"
                  endIcon={<DeleteIcon />}
                >
                  Delete record
                </Button>
              </span>
            </OnlyVisibleToUsersWith>
          </span>
        )}
        <BeaconSummaryPanel
          beaconsGateway={beaconsGateway}
          beaconId={summary.beaconId}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Beacon uses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UsesListPanel
              usesGateway={usesGateway}
              beaconId={summary.beaconId}
            />
          </AccordionDetails>
        </Accordion>
      </p>
    );
  });

  if (duplicates.length > 0) {
    return (
      <div>
        <PageHeader>Hex ID/UIN: {hexId}</PageHeader>
        <PageContent>{summaries}</PageContent>
        <DialogueBox
          isOpen={dialogueIsOpen}
          dialogueType={DialogueType.DeleteBeacon}
          reasonsForAction={reasonsForDeletion}
          confirmDialogueModel={modernConfirmDialogueModel}
          selectOption={handleDeleteDialogueAction}
        />
      </div>
    );
  } else {
    return <p>Error no records for this hex id exist</p>;
  }
};
