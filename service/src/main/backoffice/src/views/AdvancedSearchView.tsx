import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import React from "react";
import { PageContent } from "../components/layout/PageContent";
import { Chip, Paper } from "@mui/material";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  ResultCard,
} from "@appbaseio/reactivesearch";
import { Podcasts } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

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

export function AdvancedSearchView(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageContent>
        <Paper className={classes.paper}>
          <ReactiveBase
            app="beacon_search"
            url="http://localhost:9200"
            enableAppbase={false}
          >
            <DataSearch
              componentId="searchbox"
              dataField={["hexId", "mmsiNumbers"]}
              placeholder="Search for beacons"
            />
            <ReactiveList
              componentId="results"
              pagination={true}
              react={{
                and: ["searchbox", "mmsiSearchBox"],
              }}
              dataField="hexId"
              render={({ data }) => (
                <ReactiveList.ResultCardsWrapper>
                  {data.map((item: any) => (
                    <ResultCard key={item._id}>
                      <Chip
                        label={item.hexId}
                        icon={<Podcasts />}
                        component={RouterLink}
                        to={
                          item.isLegacy
                            ? "/legacy-beacons/"
                            : "/beacons/" + item.id
                        }
                        clickable
                      />
                      <ResultCard.Description>
                        <table style={{ paddingTop: "1rem" }}>
                          <tr>
                            <th>MMSI number(s):</th>
                            <td>{item.mmsiNumbers}</td>
                          </tr>
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
