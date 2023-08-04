import { FunctionComponent } from "react";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { PanelViewingState } from "components/dataPanel/PanelViewingState";
import { FieldValueTypes } from "components/dataPanel/FieldValue";

interface IAccountHolderViewingProps {
  accountHolder: IAccountHolder;
}

export const AccountHolderSummaryView: FunctionComponent<
  IAccountHolderViewingProps
> = ({ accountHolder }): JSX.Element => {
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
