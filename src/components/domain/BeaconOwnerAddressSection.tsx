import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { PageURLs } from "../../lib/urls";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { DataRowItem } from "./DataRowItem";

export const BeaconOwnerAddressSection: FunctionComponent<DraftRegistration> =
  ({
    ownerAddressLine1,
    ownerAddressLine2,
    ownerTownOrCity,
    ownerCounty,
    ownerPostcode,
  }: DraftRegistration): JSX.Element => {
    return (
      <>
        <SummaryList>
          <SummaryListItem
            labelText="Address"
            actions={[{ text: "Change", href: PageURLs.beaconOwnerAddress }]}
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
