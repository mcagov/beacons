import React, { FunctionComponent } from "react";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { SummaryList, SummaryListItem } from "../SummaryList";
import { SectionHeading } from "../Typography";
import { DataRowItem } from "./DataRowItem";

interface CheckYourAnswersBeaconDetailsSummaryProps extends DraftRegistration {
  changeUrl: string;
}

export const CheckYourAnswersBeaconDetailsSummary: FunctionComponent<CheckYourAnswersBeaconDetailsSummaryProps> =
  ({
    manufacturer,
    model,
    hexId,
    changeUrl,
  }: CheckYourAnswersBeaconDetailsSummaryProps): JSX.Element => (
    <>
      <SectionHeading>About the beacon being registered</SectionHeading>

      <SummaryList>
        <SummaryListItem
          labelText="Beacon information"
          actions={[{ text: "Change", href: changeUrl }]}
        >
          <DataRowItem label="Manufacturer" value={manufacturer} />
          <DataRowItem label="Model" value={model} />
          <DataRowItem label="Hex ID/UIN" value={hexId} />
        </SummaryListItem>
      </SummaryList>
    </>
  );
