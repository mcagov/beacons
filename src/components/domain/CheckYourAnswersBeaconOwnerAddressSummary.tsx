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
            {registration.ownerAddressLine3 && (
              <DataRowItem value={registration.ownerAddressLine3} />
            )}
            {registration.ownerAddressLine4 && (
              <DataRowItem value={registration.ownerAddressLine4} />
            )}
            {registration.ownerTownOrCity && (
              <DataRowItem value={registration.ownerTownOrCity} />
            )}
            {registration.ownerCounty && (
              <DataRowItem value={registration.ownerCounty} />
            )}
            {registration.ownerPostcode && (
              <DataRowItem value={registration.ownerPostcode} />
            )}
            {registration.ownerCountry && (
              <DataRowItem value={registration.ownerCountry} />
            )}
            <DataRowItem value={registration.ownerCountry} />
          </SummaryListItem>
        </SummaryList>
      </>
    );
  };
