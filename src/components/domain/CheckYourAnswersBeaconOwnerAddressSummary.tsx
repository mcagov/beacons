import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconOwnerAddressSummaryProps {
  registration: DraftRegistration;
  changeUrl: string;
}
export const CheckYourAnswersBeaconOwnerAddressSummary: FunctionComponent<CheckYourAnswersBeaconOwnerAddressSummaryProps> =
  ({
    registration,
    changeUrl,
  }: CheckYourAnswersBeaconOwnerAddressSummaryProps): JSX.Element => {
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="Address"
            actions={[{ text: "Change", href: changeUrl }]}
          >
            <DataRowItem value={registration.ownerAddressLine1} />
            {registration.ownerAddressLine2 && (
              <DataRowItem value={registration.ownerAddressLine2} />
            )}
            <DataRowItem value={registration.ownerTownOrCity} />
            {registration.ownerCounty && (
              <DataRowItem value={registration.ownerCounty} />
            )}
            <DataRowItem value={registration.ownerPostcode} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
