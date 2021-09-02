import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconOwnerAddressSummaryProps
  extends DraftRegistration {
  changeUrl: string;
}
export const CheckYourAnswersBeaconOwnerAddressSummary: FunctionComponent<CheckYourAnswersBeaconOwnerAddressSummaryProps> =
  ({
    ownerAddressLine1,
    ownerAddressLine2,
    ownerTownOrCity,
    ownerCounty,
    ownerPostcode,
    changeUrl,
  }: CheckYourAnswersBeaconOwnerAddressSummaryProps): JSX.Element => {
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="Address"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={ownerAddressLine1} />
            <DataRowItem value={ownerAddressLine2} />
            <DataRowItem value={ownerTownOrCity} />
            {ownerCounty && <DataRowItem value={ownerCounty} />}
            <DataRowItem value={ownerPostcode} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
