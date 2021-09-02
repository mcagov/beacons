import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconOwnerSummaryProps {
  registration: DraftRegistration;
  changeUrl: string;
}

export const CheckYourAnswersBeaconOwnerSummary: FunctionComponent<CheckYourAnswersBeaconOwnerSummaryProps> =
  ({
    registration,
    changeUrl,
  }: CheckYourAnswersBeaconOwnerSummaryProps): JSX.Element => (
    <>
      <SectionHeading>About the beacon owner</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Owner details"
          actions={[{ text: "Change", href: changeUrl }]}
        >
          <DataRowItem value={registration.ownerFullName} />
          <DataRowItem value={registration.ownerTelephoneNumber} />
          <DataRowItem value={registration.ownerAlternativeTelephoneNumber} />
          <DataRowItem value={registration.ownerEmail} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
