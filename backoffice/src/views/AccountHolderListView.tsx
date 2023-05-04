import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { logToServer } from "../utils/logger";
import { IAccountHolder } from "../entities/IAccountHolder";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";
import { IAccountHolderSearchResultData } from "../entities/IAccountHolderSearchResult";

interface IAccountHolderListViewProps {
  accountHolderGateway: IAccountHolderGateway;
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

export const AccountHolderListView: FunctionComponent<
  IAccountHolderListViewProps
> = ({ accountHolderGateway }): JSX.Element => {
  const classes = useStyles();

  const [accountHolders, setAccountHolders] = useState<
    IAccountHolderSearchResultData[]
  >([] as IAccountHolderSearchResultData[]);

  useEffect((): void => {
    const fetchAccountHolders = async () => {
      try {
        const accountHoldersResponse =
          await accountHolderGateway.getAllAccountHolders();

        setAccountHolders(accountHoldersResponse._embedded.accountHolderSearch);
      } catch (error) {
        logToServer.error(error);
      }
    };

    fetchAccountHolders();
  }, [accountHolderGateway]);

  return (
    <div className={classes.root}>
      <PageHeader>Account Holders</PageHeader>
      <PageContent>
        <Grid
          direction="row"
          container
          justifyContent="space-between"
          spacing={2}
        >
          {accountHolders.map((ah) => (
            <Grid item xs={2} key={ah.id}>
              <Card key={ah.id}>
                <CardContent>{JSON.stringify(ah)}</CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageContent>
    </div>
  );
};
