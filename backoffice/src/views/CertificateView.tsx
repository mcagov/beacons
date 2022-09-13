import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { PageContent } from "../components/layout/PageContent";
import { Certificate } from "../components/Certificate";
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

interface CertificateViewProps {
  exportsGateway: IExportsGateway;
}

export const CertificateView: FunctionComponent<CertificateViewProps> = ({
  exportsGateway,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageContent>
        <Certificate exportsGateway={exportsGateway} />
      </PageContent>
    </div>
  );
};
