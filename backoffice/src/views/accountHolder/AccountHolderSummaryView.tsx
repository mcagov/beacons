import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { FunctionComponent, useEffect, useState } from "react";
import { logToServer } from "../../utils/logger";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import { FieldValueTypes } from "components/dataPanel/FieldValue";

interface IAccountHolderViewingProps {
  accountHolder: IAccountHolder;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);

export const AccountHolderSummaryView: FunctionComponent<
  IAccountHolderViewingProps
> = ({ accountHolder }): JSX.Element => {
  const classes = useStyles();

  const accountHolderFields = [
    { key: "Name", value: accountHolder?.fullName },
    { key: "Telephone", value: accountHolder?.telephoneNumber },
    {
      key: "Alternative Telephone",
      value: accountHolder?.alternativeTelephoneNumber,
    },
    { key: "Email", value: accountHolder?.email },
    {
      key: "Address",
      value: [
        accountHolder?.addressLine1,
        accountHolder?.addressLine2,
        accountHolder?.addressLine3,
        accountHolder?.addressLine4,
        accountHolder?.townOrCity,
        accountHolder?.county,
        accountHolder?.postcode,
        accountHolder?.country || "United Kingdom",
      ],
      valueType: FieldValueTypes.MULTILINE,
    },
    { key: "Created", value: accountHolder?.createdDate },
    {
      key: "Last Modified",
      value: accountHolder?.lastModifiedDate,
    },
  ];

  return <PanelViewingState fields={accountHolderFields} />;
};
