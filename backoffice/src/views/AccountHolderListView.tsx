import { Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { FunctionComponent, useEffect, useState } from "react";
import { PageContent } from "../components/layout/PageContent";
import { PageHeader } from "../components/layout/PageHeader";
import { logToServer } from "../utils/logger";
import { IAccountHolderGateway } from "gateways/account-holder/IAccountHolderGateway";
import { IAccountHolderSearchResult } from "../entities/IAccountHolderSearchResult";
import { AccountHolderTable } from "components/accountHolder/AccountHolderTable";

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

  const [response, setResponse] = useState<IAccountHolderSearchResult>(
    {} as IAccountHolderSearchResult
  );

  useEffect((): void => {
    const fetchAccountHolders = async () => {
      try {
        const accountHoldersResponse =
          await accountHolderGateway.getAllAccountHolders();

        setResponse(accountHoldersResponse);
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
        <Paper className={classes.paper}>
          <AccountHolderTable result={response} />
        </Paper>
      </PageContent>
    </div>
  );
};
