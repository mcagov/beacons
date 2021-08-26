import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { PageURLs } from "../../lib/urls";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

export const BeaconOwnerSection: FunctionComponent<DraftRegistration> = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
}: DraftRegistration): JSX.Element => (
  <>
    <SectionHeading>About the beacon owner</SectionHeading>

    <SummaryList>
      <SummaryListItem
        labelText="Owner details"
        actions={[{ text: "Change", href: PageURLs.aboutBeaconOwner }]}
      >
        <DataRowItem value={ownerFullName} />
        <DataRowItem value={ownerTelephoneNumber} />
        <DataRowItem value={ownerAlternativeTelephoneNumber} />
        <DataRowItem value={ownerEmail} />
      </SummaryListItem>
    </SummaryList>
  </>
);
