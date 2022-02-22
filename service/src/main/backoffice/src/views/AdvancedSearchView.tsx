import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import React from "react";
import { PageContent } from "../components/layout/PageContent";
import { Paper } from "@mui/material";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  ResultCard,
} from "@appbaseio/reactivesearch";

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
              dataField="hexId"
              placeholder="Search by Hex Id"
            />
            <DataSearch
              componentId="mmsiSearchBox"
              dataField="beaconUses.mmsi"
              nestedField="beaconUses"
              fuzziness={0}
            />
            <ReactiveList
              componentId="results"
              size={6}
              pagination={true}
              react={{
                and: ["searchbox", "mmsiSearchBox"],
              }}
              dataField="hexId"
              render={({ data }) => (
                <ReactiveList.ResultCardsWrapper>
                  {data.map((item: any) => (
                    <ResultCard key={item._id}>
                      <ResultCard.Image src={item.image} />
                      <ResultCard.Title
                        dangerouslySetInnerHTML={{
                          __html: item.hexId,
                        }}
                      />
                      <ResultCard.Description>
                        {JSON.stringify(item.beaconUses, null, 2)}
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
