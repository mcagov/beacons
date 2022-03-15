import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import React from "react";
import { PageContent } from "../components/layout/PageContent";
import { Alert, Chip, Paper } from "@mui/material";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  ResultCard,
} from "@appbaseio/reactivesearch";
import { Podcasts } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { searchUrl } from "../utils/urls";
import { ErrorState } from "../components/dataPanel/PanelErrorState";
import { LoadingState } from "../components/dataPanel/PanelLoadingState";

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

type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "ERROR";

const useConnectToOpenSearch = (): ConnectionStatus => {
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>("DISCONNECTED");

  React.useEffect(() => {
    if (connectionStatus === "DISCONNECTED") {
      fetch(searchUrl(window.location.hostname) + "_cluster/health", {
        redirect: "follow",
      })
        .then(() => {
          setConnectionStatus("CONNECTED");
        })
        .catch((e) => {
          console.error(e);
          setConnectionStatus("ERROR");
        });
    }
  }, [connectionStatus, setConnectionStatus]);

  return connectionStatus;
};

export function AdvancedSearchView(): JSX.Element {
  const classes = useStyles();

  const connectionStatus = useConnectToOpenSearch();

  if (connectionStatus === "ERROR") {
    return <ErrorState message={"Failed to connect to OpenSearch"} />;
  }

  if (connectionStatus === "DISCONNECTED") {
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
              dataField={["hexId", "mmsiNumbers", "vesselNames", "callSigns"]}
              placeholder="Search for beacons"
            />
            <ReactiveList
              componentId="results"
              pagination={true}
              react={{
                and: ["searchbox"],
              }}
              dataField="hexId"
              render={({ data, error }) => (
                <ReactiveList.ResultCardsWrapper>
                  {error && <Alert severity="error">Error: {error}</Alert>}
                  {data.map((item: any) => (
                    <ResultCard key={item._id}>
                      <Chip
                        label={item.hexId}
                        icon={<Podcasts />}
                        component={RouterLink}
                        to={
                          (item.isLegacy ? "/legacy-beacons/" : "/beacons/") +
                          item.id
                        }
                        clickable
                      />
                      <ResultCard.Description>
                        <table style={{ paddingTop: "1rem" }}>
                          <tbody>
                            <tr>
                              <th>MMSI number(s):</th>
                              <td>{item.mmsiNumbers}</td>
                            </tr>
                            <tr>
                              <th>Vessel name(s):</th>
                              <td>{item.vesselNames}</td>
                            </tr>
                            <tr>
                              <th>Callsign(s):</th>
                              <td>{item.callSigns}</td>
                            </tr>
                          </tbody>
                        </table>
                      </ResultCard.Description>
                    </ResultCard>
                  ))}
                </ReactiveList.ResultCardsWrapper>
              )}
            />
          </ReactiveBase>
        </Paper>
      </PageContent>
    </div>
  );
}
