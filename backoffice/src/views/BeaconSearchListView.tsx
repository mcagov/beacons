import { Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { BeaconsTable } from "../components/BeaconsTable";
import { PageContent } from "../components/layout/PageContent";
import { IBeaconsGateway } from "../gateways/beacons/IBeaconsGateway";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface BeaconRecordsProps {
  beaconsGateway: IBeaconsGateway;
}

export const BeaconRecordsListView: FunctionComponent<BeaconRecordsProps> = ({
  beaconsGateway,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <BeaconsTable beaconsGateway={beaconsGateway} />
        </Paper>
      </PageContent>
    </div>
  );
};
