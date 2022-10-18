import { Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { FunctionComponent } from "react";
import { ExportBeaconsTable } from "../components/ExportBeaconsTable";
import { PageContent } from "../components/layout/PageContent";
import { IExportsGateway } from "../gateways/exports/IExportsGateway";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  })
);

interface BeaconExportProps {
  exportsGateway: IExportsGateway;
}

export const BeaconExportRecordsListView: FunctionComponent<
  BeaconExportProps
> = ({ exportsGateway }): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <ExportBeaconsTable exportsGateway={exportsGateway} />
        </Paper>
      </PageContent>
    </div>
  );
};
