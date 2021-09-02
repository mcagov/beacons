import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconOwnerSummaryProps extends DraftRegistration {
  changeUrl: string;
}

export const CheckYourAnswersBeaconOwnerSummary: FunctionComponent<CheckYourAnswersBeaconOwnerSummaryProps> =
  ({
    ownerFullName,
    ownerTelephoneNumber,
    ownerAlternativeTelephoneNumber,
    ownerEmail,
    changeUrl,
  }: CheckYourAnswersBeaconOwnerSummaryProps): JSX.Element => (
    <>
      <SectionHeading>About the beacon owner</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Owner details"
          actions={[{ text: "Change", href: changeUrl }]}
        >
          <DataRowItem value={ownerFullName} />
          <DataRowItem value={ownerTelephoneNumber} />
          <DataRowItem value={ownerAlternativeTelephoneNumber} />
          <DataRowItem value={ownerEmail} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
