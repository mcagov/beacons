import {
  DataSearch,
  ReactiveBase,
  ReactiveList,
} from "@appbaseio/reactivesearch";
import { Alert, Box, Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { ErrorState } from "../components/dataPanel/PanelErrorState";
import { LoadingState } from "../components/dataPanel/PanelLoadingState";
import { PageContent } from "../components/layout/PageContent";
import { ResultCard } from "../components/search/result/ResultCard";
import { WhatCanISearchFor } from "../components/search/WhatCanISearchFor";
import {
  BeaconSearchItem,
  parseBeaconSearchItem,
} from "../entities/BeaconSearch";
import { logToServer } from "../utils/logger";
import { searchUrl } from "../utils/urls";

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

type ConnectionStatus =
  | { status: "OK" }
  | { status: "ERROR"; error: string }
  | { status: "PENDING"; retryCount: number };

const useConnectToOpenSearch = (): ConnectionStatus => {
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>({ status: "PENDING", retryCount: 0 });

  React.useEffect(() => {
    if (connectionStatus.status === "PENDING") {
      fetch(searchUrl(window.location.hostname) + "_cluster/health", {
        redirect: "follow",
      })
        .then(() => {
          setConnectionStatus({ status: "OK" });
        })
        .catch((e) => {
          logToServer.error(e);
          setConnectionStatus((connectionStatus) => {
            if (
              connectionStatus.status === "PENDING" &&
              connectionStatus.retryCount < 10
            ) {
              return {
                status: "PENDING",
                retryCount: connectionStatus.retryCount + 1,
              };
            } else {
              return { status: "ERROR", error: JSON.stringify(e) };
            }
          });
        });
    }
  }, [connectionStatus]);

  return connectionStatus;
};

export function DefaultSearchView(): JSX.Element {
  const classes = useStyles();

  const connectionStatus = useConnectToOpenSearch();

  if (connectionStatus.status === "ERROR") {
    return <ErrorState message={"Failed to connect to OpenSearch"} />;
  }

  if (connectionStatus.status === "PENDING") {
    return <LoadingState />;
  }

  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <ReactiveBase
            app="beacon_search"
            url={searchUrl(window.location.hostname)}
            enableAppbase={false}
          >
            <DataSearch
              componentId="searchbox"
              dataField={[
                "hexId",
                "cospasSarsatNumber",
                "vesselMmsiNumbers",
                "vesselNames",
                "vesselCallsigns",
                "aircraftRegistrationMarks",
                "aircraft24bitHexAddresses",
              ]}
              placeholder="Search"
              addonAfter={<WhatCanISearchFor />}
            />
            <ReactiveList
              componentId="results"
              pagination={true}
              react={{
                and: ["searchbox"],
              }}
              dataField="hexId"
              size={5}
              defaultQuery={() => ({ track_total_hits: true })}
              render={({ data, error }) => (
                <Box sx={gridContainer}>
                  {error && <Alert severity="error">Error: {error}</Alert>}
                  {data.map((item: BeaconSearchItem) => {
                    const result = parseBeaconSearchItem(item);
                    return <ResultCard result={result} key={result._id} />;
                  })}
                </Box>
              )}
            />
          </ReactiveBase>
        </Paper>
      </PageContent>
    </div>
  );
}

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gridGap: 20,
};
